import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hub } from '../../dal/entity/hub.entity';
import { JoinUserHub } from '../../dal/entity/joinUserHub.entity';
import { User } from '../../dal/entity/user.entity';
import { NotificationService } from '../../notification/notification.service';

@Injectable()
export class HubGeofenceService {
  private readonly logger = new Logger(HubGeofenceService.name, true);

  constructor(
    @InjectRepository(JoinUserHub)
    private joinUserHubRepository: Repository<JoinUserHub>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Hub)
    private hubRepository: Repository<Hub>,
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

    hubRelationship.isPresent = true;
    await this.joinUserHubRepository.save(hubRelationship);

    const hub = await hubRelationship.hub;
    if (hub.active) {
      await this.notifyMembersOfArrival(userId, hubId);
    }

    return hubRelationship;
  }

  async exitedHubGeofence(userId: any, hubId: number) {
    this.logger.log(this.exitedHubGeofence.name);
    let hubRelationship = await this.joinUserHubRepository.findOne({
      userId,
      hubId,
    });

    if (!hubRelationship) {
      throw Error(
        `no corresponding hub relationship found for userId: ${userId} & hubId: ${hubId}`,
      );
    }

    hubRelationship.isPresent = false;
    hubRelationship = await this.joinUserHubRepository.save(hubRelationship);

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
    const message = `${user.firstName} arrived at ${hub.name}`;

    for (const relation of membersHubRelations) {
      await this.notificationService.addInAppNotificationForUser(
        relation.userId,
        {
          header: message,
          thumbnail: user.image,
          date: Date.now().toString(),
          actionLink: undefined,
          text: undefined,
        },
      );

      await this.notificationService.sendPushToUser(relation.userId, {
        title: message,
        click_action: undefined,
        body: undefined,
      });
    }
  }

  async notifyMembersOfExit(userId: any, hubId: number) {
    const membersHubRelations = await this.joinUserHubRepository.find({
      hubId,
    });
    const user = await this.userRepository.findOne({ id: userId });
    const hub = await this.hubRepository.findOne({ id: hubId });
    const message = `${user.firstName} exited ${hub.name}`;

    for (const relation of membersHubRelations) {
      await this.notificationService.addInAppNotificationForUser(
        relation.userId,
        {
          header: message,
          thumbnail: user.image,
          date: Date.now().toString(),
          actionLink: undefined,
          text: undefined,
        },
      );

      await this.notificationService.sendPushToUser(relation.userId, {
        title: message,
        click_action: undefined,
        body: undefined,
      });
    }
  }
}