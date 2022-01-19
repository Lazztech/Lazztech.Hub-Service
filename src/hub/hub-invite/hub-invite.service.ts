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
    this.logger.log(this.getInvitesByHub.name);
    const userHubRelationship = await this.joinUserHubRepository.findOne({
      userId,
      hubId,
      isOwner: true,
    });
    this.validateRelationship(userHubRelationship, hubId, userId);

    return await this.inviteRepository.find({
      hubId,
      accepted: includeAccepted,
    });
  }

  async getInvite(userId: any, hubId: any) {
    this.logger.log(this.getInvite.name);
    return await this.inviteRepository.findOne({
      hubId,
      inviteesId: userId,
    } as Invite);
  }

  async getInvitesByUser(userId: any, includeAccepted: boolean) {
    this.logger.log(this.getInvitesByUser.name);
    return await this.inviteRepository.find({
      inviteesId: userId,
      accepted: includeAccepted,
    } as Invite);
  }

  async inviteUserToHub(userId: any, hubId: number, inviteesEmail: string) {
    this.logger.log(this.inviteUserToHub.name);
    const userHubRelationship = await this.joinUserHubRepository.findOne({
      userId,
      hubId,
      isOwner: true,
    });
    this.validateRelationship(userHubRelationship, hubId, userId);
    
    const invitee = await this.userRepository.findOne({
        email: inviteesEmail,
    });

    if(invitee){
      const alreadyInvited = await this.inviteRepository.findOne({inviteesId: invitee.id, invitersId: userId, hubId });
      if (alreadyInvited) {
        throw new Error(`${invitee.firstName} has already been invited to ${(await alreadyInvited.hub.load()).name}`);
      }
    }
    this.validateInvitee(invitee, inviteesEmail, userId);

    const invite = this.inviteRepository.create({
      hubId,
      inviteesId: invitee.id,
      invitersId: userId,
    });
    await this.inviteRepository.persistAndFlush(invite);

    const hub = await userHubRelationship.hub.load();
    await this.notificationService.addInAppNotificationForUser(invitee.id, {
      thumbnail: hub.image,
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
    this.logger.log(this.acceptHubInvite.name);
    const invite = await this.inviteRepository.findOneOrFail({ id: inviteId });
    invite.accepted = true;

    let newRelationship = this.joinUserHubRepository.create({
      userId: inviteesId,
      hubId: invite.hubId,
      isOwner: false,
    });
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
      thumbnail: hub.image,
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
    this.logger.log(this.deleteInvite.name);
    const invite = await this.inviteRepository.findOneOrFail({ id: inviteId });
    if (invite.inviteesId == userId && invite.hubId == hubId) {
      return await this.inviteRepository.removeAndFlush(invite);
    } else {
      const userHubRelationship = await this.joinUserHubRepository.findOne({
        userId,
        hubId,
        isOwner: true,
      });
      this.validateRelationship(userHubRelationship, hubId, userId);

      return await this.inviteRepository.removeAndFlush(invite);
    }
  }

  private validateInvitee(invitee: User, inviteesEmail: string, userId: any) {
    this.logger.log(this.validateInvitee.name);

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
    this.logger.log(this.validateRelationship.name);
    if (!userHubRelationship) {
      throw new Error(
        `Could not find admin relationship to hubId: ${hubId} for userId: ${userId}.`,
      );
    }
  }
}
