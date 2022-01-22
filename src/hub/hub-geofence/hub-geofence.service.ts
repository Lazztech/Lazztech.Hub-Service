import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
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
    private notificationService: NotificationService,
  ) {}

  async enteredHubGeofence(userId: any, hubId: number) {
    this.logger.log(this.enteredHubGeofence.name);
    const hubRelationship = await this.joinUserHubRepository.findOne({
      user: userId,
      hub: hubId,
    });

    if (!hubRelationship) {
      throw Error(
        `no corresponding hub relationship found for userId: ${userId} & hubId: ${hubId}`,
      );
    }

    hubRelationship.isPresent = true;
    hubRelationship. lastUpdated = Date.now().toString();
    hubRelationship. lastGeofenceEvent = GeofenceEvent.ENTERED;
    await this.joinUserHubRepository.persistAndFlush(hubRelationship);

    const hub = await hubRelationship.hub.load();
    if (hub.active) {
      await this.notifyMembersOfArrival(userId, hubId);
    }

    return hubRelationship;
  }

  async dwellHubGeofence(userId: any, hubId: number) {
    this.logger.log(this.dwellHubGeofence.name);
    const hubRelationship = await this.joinUserHubRepository.findOne({
      user: userId,
      hub: hubId,
    });

    if (!hubRelationship) {
      throw Error(
        `no corresponding hub relationship found for userId: ${userId} & hubId: ${hubId}`,
      );
    }

    hubRelationship.isPresent = true;
    hubRelationship.lastUpdated = Date.now().toString();
    hubRelationship.lastGeofenceEvent = GeofenceEvent.DWELL;
    await this.joinUserHubRepository.persistAndFlush(hubRelationship);

    return hubRelationship;
  }

  async exitedHubGeofence(userId: any, hubId: number) {
    this.logger.log(this.exitedHubGeofence.name);
    const hubRelationship = await this.joinUserHubRepository.findOne({
      user: userId,
      hub: hubId,
    });

    if (!hubRelationship) {
      throw Error(
        `no corresponding hub relationship found for userId: ${userId} & hubId: ${hubId}`,
      );
    }

    hubRelationship.isPresent = false;
    hubRelationship.lastUpdated = Date.now().toString();
    hubRelationship.lastGeofenceEvent = GeofenceEvent.EXITED;
    await this.joinUserHubRepository.persistAndFlush(hubRelationship);

    const hub = await hubRelationship.hub.load();
    if (hub.active) {
      await this.notifyMembersOfExit(userId, hubId);
    }

    return hubRelationship;
  }

  async notifyMembersOfArrival(userId: any, hubId: number) {
    const membersHubRelations = await this.joinUserHubRepository.find({
      hub: hubId,
    });
    const user = await this.userRepository.findOne({ id: userId });
    const hub = await this.hubRepository.findOne({ id: hubId });
    const message = `${user.firstName} arrived`;

    for (const relation of membersHubRelations) {
      await this.notificationService.addInAppNotificationForUser(
        relation.user.id,
        {
          header: message,
          thumbnail: hub.image,
          date: Date.now().toString(),
          actionLink: undefined,
          text: `at the "${hub.name}" hub.`,
        },
      );

      await this.notificationService.sendPushToUser(relation.user.id, {
        title: message,
        click_action: undefined,
        body: `at the "${hub.name}" hub.`,
      });
    }
  }

  async notifyMembersOfExit(userId: any, hubId: number) {
    const membersHubRelations = await this.joinUserHubRepository.find({
      hub: hubId,
    });
    const user = await this.userRepository.findOne({ id: userId });
    const hub = await this.hubRepository.findOne({ id: hubId });
    const message = `${user.firstName} exited`;

    for (const relation of membersHubRelations) {
      await this.notificationService.addInAppNotificationForUser(
        relation.user.id,
        {
          header: message,
          thumbnail: hub.image,
          date: Date.now().toString(),
          actionLink: undefined,
          text: `the "${hub.name}" hub`,
        },
      );

      await this.notificationService.sendPushToUser(relation.user.id, {
        title: message,
        click_action: undefined,
        body: `the "${hub.name}" hub`,
      });
    }
  }
}
