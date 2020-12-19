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

  public async respondToHubInvite(
    inviteesId: number,
    invitersId: number,
    hubId: number,
    accepted: boolean,
  ) {
    this.logger.log(this.respondToHubInvite.name);
    if (accepted) {
      const invite = await this.inviteRepository.findOne({
        inviteesId,
        invitersId,
        hubId,
      });

      let newRelationship = this.joinUserHubRepository.create({
        userId: invite.inviteesId,
        hubId: invite.hubId,
        isOwner: false,
      });
      newRelationship = await this.joinUserHubRepository.save(newRelationship);
      return newRelationship;
    } else {
      return null;
    }
  }

  async deleteInvite(userId: any, hubId: any, inviteId: any) {
    this.logger.log(this.deleteInvite.name);
    const userHubRelationship = await this.joinUserHubRepository.findOne({
      userId,
      hubId,
      isOwner: true,
    });
    this.validateRelationship(userHubRelationship, hubId, userId);

    const invite = await this.inviteRepository.findOneOrFail({ id: inviteId });
    await this.inviteRepository.remove(invite);
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
