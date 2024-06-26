import { Injectable, Logger } from '@nestjs/common';
import { JoinUserHub } from '../../dal/entity/joinUserHub.entity';
import { Invite } from '../../dal/entity/invite.entity';
import { User } from '../../dal/entity/user.entity';
import { NotificationService } from '../../notification/notification.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

@Injectable()
export class HubInviteService {
  private readonly logger = new Logger(HubInviteService.name);

  constructor(
    @InjectRepository(JoinUserHub)
    private joinUserHubRepository: EntityRepository<JoinUserHub>,
    @InjectRepository(User)
    private userRepository: EntityRepository<User>,
    @InjectRepository(Invite)
    private inviteRepository: EntityRepository<Invite>,
    private notificationService: NotificationService,
  ) {}

  async getInvitesByHub(userId: any, hubId: any, includeAccepted: boolean) {
    this.logger.debug(this.getInvitesByHub.name);
    const userHubRelationship = await this.joinUserHubRepository.findOne({
      user: userId,
      hub: hubId,
      isOwner: true,
    });
    this.validateRelationship(userHubRelationship, hubId, userId);

    return await this.inviteRepository.find({
      hub: hubId,
      accepted: includeAccepted,
    });
  }

  async getInvite(userId: any, hubId: any) {
    this.logger.debug(this.getInvite.name);
    return await this.inviteRepository.findOne({
      hub: hubId,
      invitee: userId,
    } as Invite);
  }

  async getInviteById(userId: any, id: any) {
    this.logger.debug(this.getInvite.name);
    return await this.inviteRepository.findOne({
      id,
      invitee: userId,
    } as Invite);
  }

  async getInvitesByUser(userId: any, includeAccepted: boolean) {
    this.logger.debug(this.getInvitesByUser.name);
    return await this.inviteRepository.find({
      invitee: userId,
      accepted: includeAccepted,
    } as Invite);
  }

  async inviteUserToHub(userId: any, hubId: number, inviteesEmail?: string, inviteesShareableId?: string) {
    this.logger.debug(this.inviteUserToHub.name);
    if (!inviteesEmail && !inviteesShareableId) {
      throw Error('Must supply either inviteesEmail or inviteesShareableId');
    }
    const userHubRelationship = await this.joinUserHubRepository.findOne({
      user: userId,
      hub: hubId,
      isOwner: true,
    }, {
      populate: ['hub', 'hub.coverImage']
    });
    this.validateRelationship(userHubRelationship, hubId, userId);
    
    // fetch by either inviteesShareableId or else inviteesEmail if inviteesShareableId is undefined
    const invitee = await this.userRepository.findOne(
      inviteesShareableId ? { shareableId: inviteesShareableId } : { email: inviteesEmail }
    );

    if(invitee){
      const alreadyInvited = await this.inviteRepository.findOne({invitee: invitee.id, inviter: userId, hub: hubId });
      if (alreadyInvited) {
        throw new Error(`${invitee.firstName} has already been invited to ${(await alreadyInvited.hub.load()).name}`);
      }
    }
    this.validateInvitee(invitee, inviteesEmail, userId);

    const invite = this.inviteRepository.create({
      hub: hubId,
      invitee: invitee.id,
      inviter: userId,
    } as any);
    await this.inviteRepository.persistAndFlush(invite);

    const hub = await userHubRelationship.hub.load();
    await this.notificationService.addInAppNotificationForUser(invitee.id, {
      thumbnail: (await hub.coverImage.load()).fileName,
      header: `You're invited to "${hub.name}" hub.`,
      text: `View the invite.`,
      date: Date.now().toString(),
      actionLink: `preview-hub/${hubId}`,
    });

    await this.notificationService.sendPushToUser(invitee.id, {
      title: `You're invited to "${hub.name}" hub.`,
      body: `View the invite.`,
      click_action: `preview-hub/${hubId}`,
    });

    return invite;
  }

  public async acceptHubInvite(inviteesId: number, inviteId: number) {
    this.logger.debug(this.acceptHubInvite.name);
    const invite = await this.inviteRepository.findOneOrFail({ id: inviteId });
    invite.accepted = true;

    const newRelationship = this.joinUserHubRepository.create({
      user: inviteesId,
      hub: invite.hub.id,
      isOwner: false,
    } as any);
    await this.joinUserHubRepository.persistAndFlush(newRelationship);
    // does it automatically populate the newRelation now with mikro-orm?
    // newRelationship = await this.joinUserHubRepository.findOneOrFail({
    //   userId: newRelationship.userId,
    //   hubId: newRelationship.hubId,
    // });
    const invitee = await newRelationship.user.load();
    const hub = await newRelationship.hub.load();

    await this.inviteRepository.persistAndFlush(invite);
    await this.notificationService.addInAppNotificationForUser(invitee.id, {
      thumbnail: (await hub.coverImage.load()).fileName,
      header: `${invitee.firstName} accepted invite`,
      text: `to "${hub.name}" hub.`,
      date: Date.now().toString(),
      actionLink: null,
    });

    await this.notificationService.sendPushToUser(invitee.id, {
      title: `${invitee.firstName} accepted invite`,
      body: `to "${hub.name}" hub.`,
      click_action: null,
    });

    return newRelationship;
  }

  async deleteInvite(userId: any, hubId: any, inviteId: any) {
    this.logger.debug(this.deleteInvite.name);
    const invite = await this.inviteRepository.findOneOrFail({ id: inviteId });
    if (invite.invitee.id == userId && invite.hub.id == hubId) {
      return await this.inviteRepository.removeAndFlush(invite);
    } else {
      const userHubRelationship = await this.joinUserHubRepository.findOne({
        user: userId,
        hub: hubId,
        isOwner: true,
      });
      this.validateRelationship(userHubRelationship, hubId, userId);

      return await this.inviteRepository.removeAndFlush(invite);
    }
  }

  private validateInvitee(invitee: User, inviteesEmail: string, userId: any) {
    this.logger.debug(this.validateInvitee.name);

    if (!invitee) {
      throw new Error(`Did not find user to invite by email address ${inviteesEmail}. Check Spelling`);
    }
    if (invitee.id == userId) {
      throw new Error(`Cannot invite self to hub.`);
    }
  }

  private validateRelationship(
    userHubRelationship: JoinUserHub,
    hubId: number,
    userId: any,
  ) {
    this.logger.debug(this.validateRelationship.name);
    if (!userHubRelationship) {
      throw new Error(
        `Could not find admin relationship to hubId: ${hubId} for userId: ${userId}.`,
      );
    }
  }
}
