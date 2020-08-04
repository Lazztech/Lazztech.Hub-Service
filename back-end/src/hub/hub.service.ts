import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hub } from 'src/dal/entity/hub.entity';
import { JoinUserHub } from 'src/dal/entity/joinUserHub.entity';
import { User } from 'src/dal/entity/user.entity';
import { FileService } from 'src/services/file/file.service';
import { Repository } from 'typeorm';
import { NotificationService } from 'src/notification/notification.service';
import { Invite } from 'src/dal/entity/invite.entity';

@Injectable()
export class HubService {
  private readonly logger = new Logger(HubService.name, true);
  constructor(
    private fileService: FileService,
    @InjectRepository(Hub)
    private hubRepository: Repository<Hub>,
    @InjectRepository(JoinUserHub)
    private joinUserHubRepository: Repository<JoinUserHub>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Invite)
    private inviteRepository: Repository<Invite>,
    private notificationService: NotificationService,
  ) {
    this.logger.log('constructor');
  }

  async getOneUserHub(userId: any, hubId: number) {
    this.logger.log(this.getOneUserHub.name);
    return await this.joinUserHubRepository.findOne({ hubId, userId });
  }

  async getUserHubs(userId: any) {
    this.logger.log(this.getUserHubs.name);
    return await this.joinUserHubRepository.find({ userId });
  }

  public async commonUsersHubs(userId: any, otherUsersId: any) {
    this.logger.log(this.commonUsersHubs.name);
    const userHubRelationships = await this.joinUserHubRepository.find({
      userId,
    });

    const hubs = await Promise.all(userHubRelationships.map(x => x.hub));
    const commonHubRelationships = [];
    for (const hub of hubs) {
      const result = (await hub.usersConnection).find(
        x => x.userId == otherUsersId,
      );
      if (result) {
        commonHubRelationships.push(result);
      }
    }

    return commonHubRelationships;
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
    await this.notificationService.addInAppNotificationForUser(userId, {
      thumbnail: hub.image,
      header: `You're invited to "${hub.name}" hub.`,
      text: `View the invite.`,
      date: Date.now().toString(),
      actionLink: `preview-hub/${hubId}`,
    });

    await this.notificationService.sendPushToUser(userId, {
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

  async usersPeople(userId: any) {
    this.logger.log(this.usersPeople.name);
    const userHubRelationships = await this.joinUserHubRepository.find({
      userId,
    });

    const usersHubs = await Promise.all(userHubRelationships.map(x => x.hub));

    let commonConnections: JoinUserHub[] = [];
    for (const hub of usersHubs) {
      commonConnections = commonConnections.concat(await hub.usersConnection);
    }

    const resultingOtherUsers: User[] = await Promise.all(
      commonConnections.filter(x => x.userId != userId).map(x => x.user),
    );

    const uniqueUsers: User[] = [];
    for (let index = 0; index < resultingOtherUsers.length; index++) {
      const user = resultingOtherUsers[index];
      if (uniqueUsers.find(x => x.id == user.id) == undefined) {
        uniqueUsers.push(user);
      }
    }

    return uniqueUsers;
  }

  async createHub(userId: any, hub: Hub) {
    this.logger.log(this.createHub.name);
    const imageUrl = await this.fileService.storePublicImageFromBase64(
      hub.image,
    );
    // TODO save as a transaction
    const result = await this.hubRepository.save(hub);
    let joinUserHub = this.joinUserHubRepository.create({
      userId,
      hubId: hub.id,
      isOwner: true,
    });
    return await this.joinUserHubRepository.save(joinUserHub);
  }

  async deleteHub(userId: any, hubId: number) {
    this.logger.log(this.deleteHub.name);
    const userHubRelationship = await this.joinUserHubRepository.findOne({
      where: {
        userId,
        hubId,
      },
    });

    if (!userHubRelationship) {
      throw new Error(
        `deleteHub did not find a relationship between userId: ${userId} & ${hubId}`,
      );
    } else if (this.isNotOwner(userHubRelationship)) {
      throw new Error(`userId: ${userId} is not an owner of hubId: ${hubId}`);
    }
    const hub = await this.hubRepository.findOne({
      where: {
        id: hubId,
      },
    });
    if (hub.image) {
      await this.fileService.deletePublicImageFromUrl(hub.image);
    }
    await this.hubRepository.remove(hub);
  }

  private isNotOwner(userHubRelationship: JoinUserHub) {
    this.logger.log(this.isNotOwner.name);
    return !userHubRelationship.isOwner;
  }

  async editHub(userId: any, hubId: number, name: string, description: string) {
    this.logger.log(this.editHub.name);
    const joinUserHubResult = await this.joinUserHubRepository.findOne({
      userId,
      hubId,
      isOwner: true,
    });

    let hub = await joinUserHubResult.hub;
    hub.name = name;
    hub.description = description;
    hub = await this.hubRepository.save(hub);
    return hub;
  }

  async changeHubImage(userId: any, hubId: number, newImage: string) {
    this.logger.log(this.changeHubImage.name);
    const joinUserHubResult = await this.joinUserHubRepository.findOne({
      userId,
      hubId,
      isOwner: true,
    });

    let hub = await joinUserHubResult.hub;

    if (hub.image) {
      await this.fileService.deletePublicImageFromUrl(hub.image);
    }
    const imageUrl = await this.fileService.storePublicImageFromBase64(
      newImage,
    );

    hub.image = imageUrl;
    hub = await this.hubRepository.save(hub);

    return hub;
  }

  async joinHub(userId: any, id: any) {
    this.logger.log(this.joinHub.name);
    let joinUserHub = this.joinUserHubRepository.create({
      userId,
      hubId: id,
      isOwner: true,
    });
    joinUserHub = await this.joinUserHubRepository.save(joinUserHub);
    return joinUserHub;
  }

  async setHubStarred(userId: any, hubId: number) {
    this.logger.log(this.setHubStarred.name);
    const hubRelationship = await this.joinUserHubRepository.findOne({
      userId,
      hubId,
    });
    hubRelationship.starred = true;
    await this.joinUserHubRepository.save(hubRelationship);
    return hubRelationship;
  }

  async setHubNotStarred(userId: any, hubId: number) {
    this.logger.log(this.setHubNotStarred.name);
    const hubRelationship = await this.joinUserHubRepository.findOne({
      userId,
      hubId,
    });
    hubRelationship.starred = false;
    await this.joinUserHubRepository.save(hubRelationship);
    return hubRelationship;
  }

  async searchHubByName(userId: any, search: string) {
    this.logger.log(this.searchHubByName.name);
    const userHubRelationship = await this.joinUserHubRepository.find({
      userId,
    });
    search = search.toLowerCase();
    const results: Hub[] = [];
    for (let index = 0; index < userHubRelationship.length; index++) {
      const element = userHubRelationship[index];
      if ((await element.hub).name.toLowerCase().includes(search)) {
        results.push(await element.hub);
      }
    }

    return results;
  }
}
