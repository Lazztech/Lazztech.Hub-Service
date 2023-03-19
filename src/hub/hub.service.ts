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
import { Block } from '../dal/entity/block.entity';
import { v4 as uuid } from 'uuid';
import { FileUpload } from 'src/file/interfaces/file-upload.interface';
import { File } from '../dal/entity/file.entity';

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
    @InjectRepository(Block)
    private blockRepository: EntityRepository<Block>,
    @InjectRepository(File)
    private fileRepository: EntityRepository<File>,
    private notificationService: NotificationService,
  ) {
    this.logger.debug('constructor');
  }

  async getOneUserHub(userId: any, hubId: number) {
    this.logger.debug(this.getOneUserHub.name);
    return await this.joinUserHubRepository.findOneOrFail({       
      user: userId,
      hub: hubId,
    });
  }

  async joinByShareableLink(userId: any, shareableId: any) {
    this.logger.debug(this.joinByShareableLink.name);
    const hub = await this.hubRepository.findOneOrFail({ shareableId });
    try {
      return await this.joinUserHubRepository.findOneOrFail({ hub, user: userId });
    } catch (error) {
      const joinUserHub = this.joinUserHubRepository.create({
        user: userId,
        hub: hub.id,
        isOwner: false,
      } as any);
      await this.joinUserHubRepository.persistAndFlush(joinUserHub);
      return joinUserHub; 
    }
  }

  async resetShareableID(userId: any, hubId: number) {
    this.logger.debug(this.resetShareableID.name);
    const userHub = await this.joinUserHubRepository.findOneOrFail({ user: userId, hub: hubId, isOwner: true });
    const hub = await userHub.hub.load();
    hub.shareableId = uuid();
    this.hubRepository.persistAndFlush(hub);
    return userHub;
}

  async getUserHubs(userId: any) {
    this.logger.debug(this.getUserHubs.name);
    return await this.joinUserHubRepository.find({ user: userId });
  }

  public async commonUsersHubs(userId: any, otherUsersId: any) {
    this.logger.debug(this.commonUsersHubs.name);
    const userHubRelationships = await this.joinUserHubRepository.find({
      user: userId
    });

    const hubs = await Promise.all(userHubRelationships.map((x) => x.hub));
    const commonHubRelationships = [];
    for (const hub of hubs) {
      const result = (await (await hub.load()).usersConnection.loadItems()).find(
        (x) => x.user.id == otherUsersId,
      );
      if (result) {
        commonHubRelationships.push(result);
      }
    }

    return commonHubRelationships;
  }

  async usersPeople(userId: any) {
    this.logger.debug(this.usersPeople.name);
    const userHubRelationships = await this.joinUserHubRepository.find({
      user: userId
    }, {
      populate: ['hub', 'hub.usersConnection', 'hub.usersConnection.user']
    });

    const usersHubs = await Promise.all(userHubRelationships.map((x) => x.hub));

    let commonConnections: JoinUserHub[] = [];
    for (const hub of usersHubs) {
      commonConnections = commonConnections.concat(await (await hub.load()).usersConnection.loadItems());
    }

    const resultingOtherUsers: User[] = await Promise.all(
      commonConnections.filter((x) => x.user.id != userId).map((x) => x.user.load()),
    );

    const uniqueUsers: User[] = [];
    for (let index = 0; index < resultingOtherUsers.length; index++) {
      const user = resultingOtherUsers[index];
      if (uniqueUsers.find((x) => x.id == user.id) == undefined) {
        uniqueUsers.push(user);
      }
    }

    const blocks = await this.blockRepository.find({ to: userId });
    return uniqueUsers.filter(user => !blocks.find(block => block.from.id === user.id));
  }

  async createHub(userId: any, hub: Hub, image?: Promise<FileUpload>) {
    this.logger.debug(this.createHub.name);
    if (image) {
      const fileName = await this.fileService.storeImageFromFileUpload(image);
      const imageFile = {
        createdBy: userId,
        createdOn: new Date().toISOString(),
        fileName,
      } as File;
      hub.coverImage = imageFile as any;
    }

    // repository.create => save pattern used to so that the @BeforeInsert decorated method
    // will fire generating a uuid for the shareableId
    hub = this.hubRepository.create(hub);
    await this.hubRepository.persistAndFlush(hub);
    
    const joinUserHub = this.joinUserHubRepository.create({
      user: userId,
      hub: hub.id,
      isOwner: true,
    } as any);
    await this.joinUserHubRepository.persistAndFlush(joinUserHub);
    return joinUserHub;
  }

  async removeUserFromHub(userId: any, hubId: any, otherUsersId: any) {
    this.logger.debug(this.removeUserFromHub.name);
    await this.joinUserHubRepository.findOneOrFail({ user: userId, hub: hubId, isOwner: true });
    if (userId == otherUsersId) {
      throw new Error(
        `You cannot delete your relationship to the hub as an owner.`,
      );
    }
    const userToBeRemoved = await this.joinUserHubRepository.findOneOrFail({ user: otherUsersId, hub: hubId });
    await this.joinUserHubRepository.removeAndFlush(userToBeRemoved);
  }

  async deleteHub(userId: any, hubId: number) {
    this.logger.debug(this.deleteHub.name);
    const userHubRelationship = await this.joinUserHubRepository.findOne({
        user: userId,
        hub: hubId,
      });

    if (!userHubRelationship) {
      throw new Error(
        `deleteHub did not find a relationship between userId: ${userId} & ${hubId}`,
      );
    } else if (this.isNotOwner(userHubRelationship)) {
      throw new Error(`userId: ${userId} is not an owner of hubId: ${hubId}`);
    }
    const hub = await this.hubRepository.findOne({ id: hubId }, {
      populate: ['coverImage']
    });
    if (hub.legacyImage) {
      await this.fileService.delete(hub.legacyImage);
    }
    if (hub.coverImage) {
      await this.fileService.delete((await hub.coverImage.load()).fileName);
    }
    await this.hubRepository.removeAndFlush(hub);
  }

  private isNotOwner(userHubRelationship: JoinUserHub) {
    this.logger.debug(this.isNotOwner.name);
    return !userHubRelationship.isOwner;
  }

  async updateHub(userId: any, value: Hub, image?: Promise<FileUpload>): Promise<Hub> {
    this.logger.debug(this.updateHub.name);
    const joinUserHubResult = await this.joinUserHubRepository.findOneOrFail({
      user: userId,
      hub: value.id,
      isOwner: true,
    }, {
      populate: ['hub']
    });

    if (image) {
      if (value?.legacyImage) {
        await this.fileService.delete(value.legacyImage).catch(err => this.logger.warn(err));
      }
      if (value?.coverImage) {
        await this.fileService.delete((await value.coverImage.load()).fileName).catch(err => this.logger.warn(err));
      }
      const fileName = await this.fileService.storeImageFromFileUpload(image);
      const imageFile = {
        createdBy: userId,
        createdOn: new Date().toISOString(),
        fileName,
      } as File;
      value.coverImage = imageFile as any; 
    } else {
        delete value?.legacyImage;
    }

    let hub = await joinUserHubResult.hub.load();
    hub = this.hubRepository.assign(hub, value);
    await this.hubRepository.persistAndFlush(hub);
    return hub;
  }

  /**
   * @deprecated use updateHub
   */
  async editHub(userId: any, hubId: number, name: string, description: string) {
    this.logger.debug(this.editHub.name);
    const joinUserHubResult = await this.joinUserHubRepository.findOne({
      user: userId,
      hub: hubId,
      isOwner: true,
    });

    const hub = await joinUserHubResult.hub.load();
    hub.name = name;
    hub.description = description;
    await this.hubRepository.persistAndFlush(hub);
    return hub;
  }

  /**
   * @deprecated use updateHub
   */
  async changeHubLocation(
    userId: any,
    hubId: number,
    latitude: number,
    longitude: number,
  ) {
    this.logger.debug(this.changeHubLocation.name);
    const joinUserHubResult = await this.joinUserHubRepository.findOne({
      user: userId,
      hub: hubId,
      isOwner: true,
    });

    const hub = await joinUserHubResult.hub.load();
    hub.latitude = latitude;
    hub.longitude = longitude;
    await this.hubRepository.persistAndFlush(hub);

    const relationships = await this.joinUserHubRepository.find({
      hub: hubId,
    });
    const user = await joinUserHubResult.user.load();
    for (const relationship of relationships) {
      await this.notificationService.addInAppNotificationForUser(
        relationship.user.id,
        {
          header: `${hub.name} had its location changed.`,
          text: `By ${user.firstName} ${user.lastName}`,
          date: Date.now().toString(),
          thumbnail: (await hub.coverImage.load()).fileName,
          actionLink: undefined,
        },
      );

      await this.notificationService.sendPushToUser(relationship.user.id, {
        title: `${hub.name} had its location changed.`,
        body: `By ${user.firstName} ${user.lastName}`,
        click_action: undefined,
      });
    }

    return hub;
  }

  async changeHubImage(userId: any, hubId: number, newImage: string) {
    this.logger.debug(this.changeHubImage.name);
    const joinUserHubResult = await this.joinUserHubRepository.findOne({
      user: userId,
      hub: hubId,
      isOwner: true,
    }, {
      populate: ['hub', 'hub.coverImage']
    });

    const hub = await joinUserHubResult.hub.load();

    if (hub.legacyImage) {
      await this.fileService.delete(hub.legacyImage);
    }
    if (hub.coverImage) {
      await this.fileService.delete((await hub.coverImage.load()).fileName);
    }
    const fileName = await this.fileService.storeImageFromBase64(newImage);
    const imageFile = {
      createdBy: userId,
      createdOn: new Date().toISOString(),
      fileName,
    } as File;

    hub.coverImage = imageFile as any;
    await this.hubRepository.persistAndFlush(hub);

    return hub;
  }

  async leaveHub(userId: any, hubId: number) {
    this.logger.debug(this.leaveHub.name);
    const joinUserHub = await this.joinUserHubRepository.findOneOrFail({
      user: userId,
      hub: hubId,
    });
    await this.joinUserHubRepository.removeAndFlush(joinUserHub);

    const invite = await this.inviteRepository.findOne({
      invitee: userId,
      hub: hubId,
    });
    await this.inviteRepository.removeAndFlush(invite);
  }

  async setHubStarred(userId: any, hubId: number) {
    this.logger.debug(this.setHubStarred.name);
    const hubRelationship = await this.joinUserHubRepository.findOne({
      user: userId,
      hub: hubId,
    });
    hubRelationship.starred = true;
    await this.joinUserHubRepository.persistAndFlush(hubRelationship);
    return hubRelationship;
  }

  async setHubNotStarred(userId: any, hubId: number) {
    this.logger.debug(this.setHubNotStarred.name);
    const hubRelationship = await this.joinUserHubRepository.findOne({
      user: userId,
      hub: hubId,
    });
    hubRelationship.starred = false;
    await this.joinUserHubRepository.persistAndFlush(hubRelationship);
    return hubRelationship;
  }

  async mute(userId: any, hubId: number) {
    this.logger.debug(this.mute.name);
    const hubRelationship = await this.joinUserHubRepository.findOneOrFail({
      user: userId,
      hub: hubId,
    });
    hubRelationship.muted = true;
    await this.joinUserHubRepository.persistAndFlush(hubRelationship);
    return hubRelationship;
  }

  async unmute(userId: any, hubId: number) {
    this.logger.debug(this.unmute.name);
    const hubRelationship = await this.joinUserHubRepository.findOneOrFail({
      user: userId,
      hub: hubId,
    });
    hubRelationship.muted = false;
    await this.joinUserHubRepository.persistAndFlush(hubRelationship);
    return hubRelationship;
  }

  async searchHubByName(userId: any, search: string) {
    this.logger.debug(this.searchHubByName.name);
    const userHubRelationship = await this.joinUserHubRepository.find({
      user: userId,
    });
    search = search.toLowerCase();
    const results: Hub[] = [];
    for (let index = 0; index < userHubRelationship.length; index++) {
      const element = userHubRelationship[index];
      const hub = await element.hub.load();
      if (hub.name.toLowerCase().includes(search)) {
        results.push(hub);
      }
    }

    return results;
  }
}
