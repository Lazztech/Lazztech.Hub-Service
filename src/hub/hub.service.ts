import { Inject, Injectable, Logger } from '@nestjs/common';
import { Hub } from '../dal/entity/hub.entity';
import { Invite } from '../dal/entity/invite.entity';
import { JoinUserHub } from '../dal/entity/joinUserHub.entity';
import { User } from '../dal/entity/user.entity';
import { FileServiceInterface } from '../file/interfaces/file-service.interface';
import { FILE_SERVICE } from '../file/file-service.token';
import { NotificationService } from '../notification/notification.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

@Injectable()
export class HubService {
  private readonly logger = new Logger(HubService.name);
  constructor(
    @Inject(FILE_SERVICE)
    private readonly fileService: FileServiceInterface,
    @InjectRepository(Hub)
    private hubRepository: EntityRepository<Hub>,
    @InjectRepository(JoinUserHub)
    private joinUserHubRepository: EntityRepository<JoinUserHub>,
    @InjectRepository(Invite)
    private inviteRepository: EntityRepository<Invite>,
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

    const hubs = await Promise.all(userHubRelationships.map((x) => x.hub));
    const commonHubRelationships = [];
    for (const hub of hubs) {
      const result = (await hub.usersConnection).find(
        (x) => x.userId == otherUsersId,
      );
      if (result) {
        commonHubRelationships.push(result);
      }
    }

    return commonHubRelationships;
  }

  async usersPeople(userId: any) {
    this.logger.log(this.usersPeople.name);
    const userHubRelationships = await this.joinUserHubRepository.find({
      userId,
    });

    const usersHubs = await Promise.all(userHubRelationships.map((x) => x.hub));

    let commonConnections: JoinUserHub[] = [];
    for (const hub of usersHubs) {
      commonConnections = commonConnections.concat(await hub.usersConnection);
    }

    const resultingOtherUsers: User[] = await Promise.all(
      commonConnections.filter((x) => x.userId != userId).map((x) => x.user),
    );

    const uniqueUsers: User[] = [];
    for (let index = 0; index < resultingOtherUsers.length; index++) {
      const user = resultingOtherUsers[index];
      if (uniqueUsers.find((x) => x.id == user.id) == undefined) {
        uniqueUsers.push(user);
      }
    }

    return uniqueUsers;
  }

  async createHub(userId: any, hub: Hub) {
    this.logger.log(this.createHub.name);
    const imageUrl = await this.fileService.storeImageFromBase64(hub.image);
    hub.image = imageUrl;
    // repository.create => save pattern used to so that the @BeforeInsert decorated method
    // will fire generating a uuid for the shareableId
    const persistedHub = await this.hubRepository.persistAndFlush(this.hubRepository.create(hub));
    
    const joinUserHub = this.joinUserHubRepository.create({
      userId,
      hubId: persistedHub.id,
      isOwner: true,
    });
    await this.joinUserHubRepository.persistAndFlush(joinUserHub);
    return joinUserHub;
  }

  async deleteHub(userId: any, hubId: number) {
    this.logger.log(this.deleteHub.name);
    const userHubRelationship = await this.joinUserHubRepository.findOne({
        userId,
        hubId,
      });

    if (!userHubRelationship) {
      throw new Error(
        `deleteHub did not find a relationship between userId: ${userId} & ${hubId}`,
      );
    } else if (this.isNotOwner(userHubRelationship)) {
      throw new Error(`userId: ${userId} is not an owner of hubId: ${hubId}`);
    }
    const hub = await this.hubRepository.findOne({ id: hubId });
    if (hub.image) {
      await this.fileService.delete(hub.image);
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
    await this.hubRepository.persistAndFlush(hub);
    return hub;
  }

  async changeHubLocation(
    userId: any,
    hubId: number,
    latitude: number,
    longitude: number,
  ) {
    this.logger.log(this.changeHubLocation.name);
    const joinUserHubResult = await this.joinUserHubRepository.findOne({
      userId,
      hubId,
      isOwner: true,
    });

    let hub = await joinUserHubResult.hub;
    hub.latitude = latitude;
    hub.longitude = longitude;
    await this.hubRepository.persistAndFlush(hub);

    const relationships = await this.joinUserHubRepository.find({
      hubId,
    });
    const user = await joinUserHubResult.user;
    for (const relationship of relationships) {
      await this.notificationService.addInAppNotificationForUser(
        relationship.userId,
        {
          header: `${hub.name} had its location changed.`,
          text: `By ${user.firstName} ${user.lastName}`,
          date: Date.now().toString(),
          thumbnail: hub.image,
          actionLink: undefined,
        },
      );

      await this.notificationService.sendPushToUser(relationship.userId, {
        title: `${hub.name} had its location changed.`,
        body: `By ${user.firstName} ${user.lastName}`,
        click_action: undefined,
      });
    }

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
      await this.fileService.delete(hub.image);
    }
    const imageUrl = await this.fileService.storeImageFromBase64(newImage);

    hub.image = imageUrl;
    await this.hubRepository.persistAndFlush(hub);

    return hub;
  }

  async leaveHub(userId: any, hubId: number) {
    this.logger.log(this.leaveHub.name);
    const joinUserHub = await this.joinUserHubRepository.findOneOrFail({
      userId,
      hubId,
    });
    await this.joinUserHubRepository.remove(joinUserHub);

    const invite = await this.inviteRepository.findOne({
      inviteesId: userId,
      hubId,
    });
    await this.inviteRepository.remove(invite);
  }

  async setHubStarred(userId: any, hubId: number) {
    this.logger.log(this.setHubStarred.name);
    const hubRelationship = await this.joinUserHubRepository.findOne({
      userId,
      hubId,
    });
    hubRelationship.starred = true;
    await this.joinUserHubRepository.persistAndFlush(hubRelationship);
    return hubRelationship;
  }

  async setHubNotStarred(userId: any, hubId: number) {
    this.logger.log(this.setHubNotStarred.name);
    const hubRelationship = await this.joinUserHubRepository.findOne({
      userId,
      hubId,
    });
    hubRelationship.starred = false;
    await this.joinUserHubRepository.persistAndFlush(hubRelationship);
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
