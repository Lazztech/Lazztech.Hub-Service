import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hub } from 'src/dal/entity/hub.entity';
import { JoinUserHub } from 'src/dal/entity/joinUserHub.entity';
import { User } from 'src/dal/entity/user.entity';
import { FileService } from 'src/services/file/file.service';
import { Repository } from 'typeorm';

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
  ) {
    this.logger.log('constructor');
  }

  async getOneUserHub(userId: any, hubId: number) {
    const userHubRelationship = await this.joinUserHubRepository.findOne({
      where: {
        hubId,
        userId,
      },
      relations: [
        'hub',
        'hub.usersConnection',
        'hub.usersConnection.user',
        'hub.microChats',
      ],
    });
    return userHubRelationship;
  }

  async getUserHubs(userId: any) {
    const userHubRelationships = await this.joinUserHubRepository.find({
      where: {
        userId: userId,
      },
      relations: ['hub', 'hub.usersConnection'],
    });
    return userHubRelationships;
  }

  public async commonUsersHubs(userId: any, otherUsersId: any) {
    const userHubRelationships = await this.joinUserHubRepository.find({
      where: {
        userId: userId,
      },
      relations: [
        'hub',
        'hub.usersConnection',
        'hub.usersConnection.hub',
        'hub.usersConnection.hub.usersConnection',
      ],
    });

    let commonHubRelationships = [];

    for (let index = 0; index < userHubRelationships.length; index++) {
      const element = userHubRelationships[index];
      const result = element.hub.usersConnection.find(x => x.userId == otherUsersId);
      if (result) {
        commonHubRelationships.push(
          element.hub.usersConnection.find(x => x.userId == otherUsersId),
        );
      }
    }

    return commonHubRelationships;
  }

  async inviteUserToHub(userId: any, hubId: number, inviteesEmail: string) {
    const userHubRelationship = await this.joinUserHubRepository.findOne({
      where: {
        userId: userId,
        hubId: hubId,
        isOwner: true,
      },
      relations: ['hub'],
    });
    this.validateRelationship(userHubRelationship, hubId, userId);

    const invitee = await this.userRepository.findOne({
      where: {
        email: inviteesEmail,
      },
    });
    this.validateInvitee(invitee, inviteesEmail, userId);

    let newRelationship = this.joinUserHubRepository.create({
      userId: invitee.id,
      hubId,
      isOwner: false,
    });
    newRelationship = await this.joinUserHubRepository.save(newRelationship);
  }

  private validateInvitee(invitee: User, inviteesEmail: string, userId: any) {
    if (!invitee) {
      throw new Error(`Did not find user to invite by email address: ${inviteesEmail}`);
    }
    if (invitee.id == userId) {
      throw new Error(`Cannot invite self to hub.`);
    }
  }

  private validateRelationship(userHubRelationship: JoinUserHub, hubId: number, userId: any) {
    if (!userHubRelationship) {
      throw new Error(`Could not find admin relationship to hubId: ${hubId} for userId: ${userId}.`);
    }
  }

  async usersPeople(userId: any) {
    const userHubRelationships = await this.joinUserHubRepository.find({
      where: {
        userId: userId,
      },
      relations: [
        'hub',
        'hub.usersConnection',
        'hub.usersConnection.user'
      ]
    });

    const usersHubs = userHubRelationships.map(x => x.hub);

    let commonConnections: Array<JoinUserHub> = [];
    for (const hub of usersHubs) {
      commonConnections = commonConnections.concat(hub.usersConnection)
    }

    let resultingOtherUsers: Array<User> = commonConnections
      .filter(x => x.userId !== userId)
      .map(x => x.user);

    let uniqueUsers: Array<User> = [];
    for (let index = 0; index < resultingOtherUsers.length; index++) {
      const user = resultingOtherUsers[index];
      if (uniqueUsers.find(x => x.id == user.id) == undefined) {
        uniqueUsers.push(user);
      }
    }

    return uniqueUsers;
  }

  async createHub(userId: any, hub: Hub) {
    const imageUrl = await this.fileService.storePublicImageFromBase64(hub.image);
    //TODO save as a transaction
    const result = await this.hubRepository.save(hub);
    let joinUserHub = this.joinUserHubRepository.create({
      userId: userId,
      hubId: hub.id,
      isOwner: true,
    });
    joinUserHub = await this.joinUserHubRepository.save(joinUserHub);

    return hub;
  }

  async deleteHub(userId: any, hubId: number) {
    const userHubRelationship = await this.joinUserHubRepository.findOne({
      where: {
        userId: userId,
        hubId: hubId
      }
    });
    
    if (!userHubRelationship) {
      throw new Error(`deleteHub did not find a relationship between userId: ${userId} & ${hubId}`);
    }
    else if (this.isNotOwner(userHubRelationship)) {
      throw new Error(`userId: ${userId} is not an owner of hubId: ${hubId}`);
    }

    //TODO ensure image is deleted

    const hub = await this.hubRepository.findOne({
      where: {
        id: hubId,
      },
    });
    await this.hubRepository.remove(hub);
  }

  private isNotOwner(userHubRelationship: JoinUserHub) {
    return !userHubRelationship.isOwner;
  }

  async editHub(userId: any, hubId: number, name: string, description: string) {
    const joinUserHubResult = await this.joinUserHubRepository.findOne({
      where: {
        userId: userId,
        hubId,
        isOwner: true,
      },
      relations: ['hub'],
    });

    let hub = joinUserHubResult.hub;
    hub.name = name;
    hub.description = description;
    hub = await this.hubRepository.save(hub);
    return hub;
  }

  async changeHubImage(userId: any, hubId: number, newImage: string) {
    const joinUserHubResult = await this.joinUserHubRepository.findOne({
      where: {
        userId: userId,
        hubId,
        isOwner: true,
      },
      relations: ['hub'],
    });

    let hub = joinUserHubResult.hub;

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
    let joinUserHub = await this.joinUserHubRepository.create({
      userId: userId,
      hubId: id,
      isOwner: true,
    });
    joinUserHub = await this.joinUserHubRepository.save(joinUserHub);
  }

  async setHubStarred(userId: any, hubId: number) {
    const hubRelationship = await this.joinUserHubRepository.findOne({
      userId: userId,
      hubId: hubId,
    });
    hubRelationship.starred = true;
    await this.joinUserHubRepository.save(hubRelationship);
  }

  async setHubNotStarred(userId: any, hubId: number) {
    const hubRelationship = await this.joinUserHubRepository.findOne({
      userId: userId,
      hubId: hubId,
    });
    hubRelationship.starred = false;
    await this.joinUserHubRepository.save(hubRelationship);
  }

  async searchHubByName(userId: any, search: string) {
    const userHubRelationship = await this.joinUserHubRepository.find({
      where: {
        userId: userId,
      },
      relations: ['hub'],
    });
    search = search.toLowerCase();
    let results: Hub[] = [];
    for (let index = 0; index < userHubRelationship.length; index++) {
      const element = userHubRelationship[index];
      if (element.hub.name.toLowerCase().includes(search)) {
        results.push(element.hub);
      }
    }

    return results;
  }
}
