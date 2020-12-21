import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinUserHub } from 'src/dal/entity/joinUserHub.entity';
import { Repository } from 'typeorm';
import { Invite } from 'src/dal/entity/invite.entity';
import { User } from 'src/dal/entity/user.entity';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class HubInviteService {
  private readonly logger = new Logger(HubInviteService.name, true);

  constructor(
    @InjectRepository(JoinUserHub)
    private joinUserHubRepository: Repository<JoinUserHub>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Invite)
    private inviteRepository: Repository<Invite>,
    private notificationService: NotificationService,
  ) {}

  async getInvitesByHub(userId: any, hubId: any) {
    this.logger.log(this.getInvitesByHub.name);
    const userHubRelationship = await this.joinUserHubRepository.findOne({
      userId,
      hubId,
      isOwner: true,
    });
    this.validateRelationship(userHubRelationship, hubId, userId);

    return await this.inviteRepository.find({ hubId });
  }

  async getInvite(userId: any, hubId: any) {
    this.logger.log(this.getInvite.name);
    return await this.inviteRepository.findOne({
      hubId,
      inviteesId: userId
    } as Invite);
  }

  async getInvitesByUser(userId: any, includeAccepted: boolean) {
    this.logger.log(this.getInvitesByUser.name);
    if (includeAccepted) {
      return await this.inviteRepository.find({
        inviteesId: userId,
      } as Invite);
    } else {
      return await this.inviteRepository.find({
        inviteesId: userId,
        accepted: false
      });
    }
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
      where: {
        email: inviteesEmail,
      },
    });
    this.validateInvitee(invitee, inviteesEmail, userId);

    let invite = this.inviteRepository.create({
      hubId,
      inviteesId: invitee.id,
      invitersId: userId,
    });
    invite = await this.inviteRepository.save(invite);

    const hub = await userHubRelationship.hub;
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

  public async acceptHubInvite(
    inviteesId: number,
    inviteId: number
  ) {
    this.logger.log(this.acceptHubInvite.name);
    let invite = await this.inviteRepository.findOneOrFail({ id: inviteId });
    invite.accepted = true;

    let newRelationship = this.joinUserHubRepository.create({
      userId: invite.inviteesId,
      hubId: invite.hubId,
      isOwner: false,
    });
    newRelationship = await this.joinUserHubRepository.save(newRelationship);

    invite = await this.inviteRepository.save(invite);
    return newRelationship;
  }

  async deleteInvite(userId: any, hubId: any, inviteId: any) {
    this.logger.log(this.deleteInvite.name);
    const invite = await this.inviteRepository.findOneOrFail({ id: inviteId });
    if (invite.inviteesId == userId && invite.hubId == hubId) {
      return await this.inviteRepository.remove(invite);
    } 
    else {
      const userHubRelationship = await this.joinUserHubRepository.findOne({
        userId,
        hubId,
        isOwner: true,
      });
      this.validateRelationship(userHubRelationship, hubId, userId);
  
      return await this.inviteRepository.remove(invite);
    }
  }

  private validateInvitee(invitee: User, inviteesEmail: string, userId: any) {
    this.logger.log(this.validateInvitee.name);
    if (!invitee) {
      throw new Error(`Did not find user to invite by email address`);
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
