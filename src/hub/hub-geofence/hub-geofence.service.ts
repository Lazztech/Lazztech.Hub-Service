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
      userId,
      hubId,
    });

    if (!hubRelationship) {
      throw Error(
        `no corresponding hub relationship found for userId: ${userId} & hubId: ${hubId}`,
      );
    }

    this.joinUserHubRepository.persist({
      ...hubRelationship,
      isPresent: true,
      lastUpdated: Date.now().toString(),
      lastGeofenceEvent: GeofenceEvent.ENTERED
    })

    const hub = await hubRelationship.hub;
    if (hub.active) {
      await this.notifyMembersOfArrival(userId, hubId);
    }

    return hubRelationship;
  }

  async dwellHubGeofence(userId: any, hubId: number) {
    this.logger.log(this.dwellHubGeofence.name);
    const hubRelationship = await this.joinUserHubRepository.findOne({
      userId,
      hubId,
    });

    if (!hubRelationship) {
      throw Error(
        `no corresponding hub relationship found for userId: ${userId} & hubId: ${hubId}`,
      );
    }

    await this.joinUserHubRepository.persist({
      ...hubRelationship,
      isPresent: true,
      lastUpdated: Date.now().toString(),
      lastGeofenceEvent: GeofenceEvent.DWELL
    })

    return hubRelationship;
  }

  async exitedHubGeofence(userId: any, hubId: number) {
    this.logger.log(this.exitedHubGeofence.name);
    const hubRelationship = await this.joinUserHubRepository.findOne({
      userId,
      hubId,
    });

    if (!hubRelationship) {
      throw Error(
        `no corresponding hub relationship found for userId: ${userId} & hubId: ${hubId}`,
      );
    }

    await this.joinUserHubRepository.persist({
      ...hubRelationship,
      isPresent: false,
      lastUpdated: Date.now().toString(),
      lastGeofenceEvent: GeofenceEvent.EXITED
    })

    const hub = await hubRelationship.hub;
    if (hub.active) {
      await this.notifyMembersOfExit(userId, hubId);
    }

    return hubRelationship;
  }

  async notifyMembersOfArrival(userId: any, hubId: number) {
    const membersHubRelations = await this.joinUserHubRepository.find({
      hubId,
    });
    const user = await this.userRepository.findOne({ id: userId });
    const hub = await this.hubRepository.findOne({ id: hubId });
    const message = `${user.firstName} arrived`;

    for (const relation of membersHubRelations) {
      await this.notificationService.addInAppNotificationForUser(
        relation.userId,
        {
          header: message,
          thumbnail: hub.image,
          date: Date.now().toString(),
          actionLink: undefined,
          text: `at the "${hub.name}" hub.`,
        },
      );

      await this.notificationService.sendPushToUser(relation.userId, {
        title: message,
        click_action: undefined,
        body: `at the "${hub.name}" hub.`,
      });
    }
  }

  async notifyMembersOfExit(userId: any, hubId: number) {
    const membersHubRelations = await this.joinUserHubRepository.find({
      hubId,
    });
    const user = await this.userRepository.findOne({ id: userId });
    const hub = await this.hubRepository.findOne({ id: hubId });
    const message = `${user.firstName} exited`;

    for (const relation of membersHubRelations) {
      await this.notificationService.addInAppNotificationForUser(
        relation.userId,
        {
          header: message,
          thumbnail: hub.image,
          date: Date.now().toString(),
          actionLink: undefined,
          text: `the "${hub.name}" hub`,
        },
      );

      await this.notificationService.sendPushToUser(relation.userId, {
        title: message,
        click_action: undefined,
        body: `the "${hub.name}" hub`,
      });
    }
  }
}
