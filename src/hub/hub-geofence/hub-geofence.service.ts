import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Block } from '../../dal/entity/block.entity';
import { Hub } from '../../dal/entity/hub.entity';
import { GeofenceEvent, JoinUserHub } from '../../dal/entity/joinUserHub.entity';
import { User } from '../../dal/entity/user.entity';
import { NotificationService } from '../../notification/notification.service';

@Injectable()
export class HubGeofenceService {
  private readonly logger = new Logger(HubGeofenceService.name);

  constructor(
    @InjectRepository(JoinUserHub)
    private joinUserHubRepository: EntityRepository<JoinUserHub>,
    @InjectRepository(User)
    private userRepository: EntityRepository<User>,
    @InjectRepository(Hub)
    private hubRepository: EntityRepository<Hub>,
    @InjectRepository(Block)
    private blockRepository: EntityRepository<Block>,
    private notificationService: NotificationService,
  ) {}

  async enteredHubGeofence(userId: any, hubId: number) {
    this.logger.debug(this.enteredHubGeofence.name);
    const hubRelationship = await this.joinUserHubRepository.findOneOrFail({
      user: userId,
      hub: hubId,
    });

    hubRelationship.lastUpdated = Date.now().toString();
    hubRelationship.lastGeofenceEvent = GeofenceEvent.ENTERED;

    if (!hubRelationship.isPresent) {
      hubRelationship.isPresent = true;  
      await this.joinUserHubRepository.persistAndFlush(hubRelationship);

      // const hub = await hubRelationship.hub.load();
      // if (hub.active) {
      //   await this.notifyMembersOfArrival(userId, hubId);
      // }
    } else {
      await this.joinUserHubRepository.persistAndFlush(hubRelationship);
    }

    return hubRelationship;
  }

  async dwellHubGeofence(userId: any, hubId: number) {
    this.logger.debug(this.dwellHubGeofence.name);
    const hubRelationship = await this.joinUserHubRepository.findOneOrFail({
      user: userId,
      hub: hubId,
    });

    hubRelationship.lastUpdated = Date.now().toString();
    hubRelationship.lastGeofenceEvent = GeofenceEvent.DWELL;

    if (!hubRelationship.isPresent) {
      hubRelationship.isPresent = true;
    }

    await this.joinUserHubRepository.persistAndFlush(hubRelationship);
    return hubRelationship;
  }

  async exitedHubGeofence(userId: any, hubId: number) {
    this.logger.debug(this.exitedHubGeofence.name);
    const hubRelationship = await this.joinUserHubRepository.findOneOrFail({
      user: userId,
      hub: hubId,
    });

    hubRelationship.lastUpdated = Date.now().toString();
    hubRelationship.lastGeofenceEvent = GeofenceEvent.EXITED;

    if (hubRelationship.isPresent) {
      hubRelationship.isPresent = false;
      await this.joinUserHubRepository.persistAndFlush(hubRelationship);

      // const hub = await hubRelationship.hub.load();
      // if (hub.active) {
      //   await this.notifyMembersOfExit(userId, hubId);
      // }
    } else {
      await this.joinUserHubRepository.persistAndFlush(hubRelationship);
    }

    return hubRelationship;
  }

  async notifyMembersOfArrival(userId: any, hubId: number) {
    const membersHubRelations = await this.joinUserHubRepository.find({
      hub: hubId,
    });
    const blocks = await this.blockRepository.find({ from: userId });
    const unblockedRelations = membersHubRelations.filter(
      relation => !blocks.find(block => block.to.id === relation.user.id)
    );
    const user = await this.userRepository.findOne({ id: userId });
    const hub = await this.hubRepository.findOne({ id: hubId });
    const message = `${user.firstName} arrived`;

    for (const relation of unblockedRelations) {
      if (!relation.muted) {
        await this.notificationService.sendPushToUser(relation.user.id, {
          title: message,
          click_action: undefined,
          body: `at the "${hub.name}" hub.`,
        });
      }
    }
  }

  async notifyMembersOfExit(userId: any, hubId: number) {
    const membersHubRelations = await this.joinUserHubRepository.find({
      hub: hubId,
    });
    const blocks = await this.blockRepository.find({ from: userId });
    const unblockedRelations = membersHubRelations.filter(
      relation => !blocks.find(block => block.to.id === relation.user.id)
    );
    const user = await this.userRepository.findOne({ id: userId });
    const hub = await this.hubRepository.findOne({ id: hubId });
    const message = `${user.firstName} exited`;

    for (const relation of unblockedRelations) {
      if (!relation.muted) {
        await this.notificationService.sendPushToUser(relation.user.id, {
          title: message,
          click_action: undefined,
          body: `the "${hub.name}" hub`,
        });
      }
    }
  }
}
