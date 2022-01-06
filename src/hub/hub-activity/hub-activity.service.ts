import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Hub } from '../../dal/entity/hub.entity';
import { InAppNotification } from '../../dal/entity/inAppNotification.entity';
import { JoinUserHub } from '../../dal/entity/joinUserHub.entity';
import { PushNotificationDto } from '../../notification/dto/pushNotification.dto';
import { NotificationService } from '../../notification/notification.service';

@Injectable()
export class HubActivityService {
  private readonly logger = new Logger(HubActivityService.name);

  constructor(
    @InjectRepository(JoinUserHub)
    private joinUserHubRepository: EntityRepository<JoinUserHub>,
    @InjectRepository(Hub)
    private hubRepository: EntityRepository<Hub>,
    @InjectRepository(InAppNotification)
    private inAppNotificationRepository: EntityRepository<InAppNotification>,
    private notificationService: NotificationService,
  ) {
    this.logger.log('constructor');
  }

  async activateHub(userId: any, hubId: number) {
    this.logger.log(this.activateHub.name);
    const hubRelationship = await this.joinUserHubRepository.findOne({
      userId,
      hubId,
      isOwner: true,
    });

    if (!hubRelationship) {
      throw Error(
        `no corresponding hub relationship found for userId: ${userId} & hubId: ${hubId}`,
      );
    }

    let hub = await hubRelationship.hub;
    hub.active = true;
    await this.hubRepository.persist(hub);

    await this.notifyOfHubActivated(hubId);
    return hub;
  }

  async deactivateHub(userId: any, hubId: number) {
    this.logger.log(this.deactivateHub.name);
    const hubRelationship = await this.joinUserHubRepository.findOne({
      userId,
      hubId,
      isOwner: true,
    });

    if (!hubRelationship) {
      throw Error(
        `no corresponding hub relationship found for userId: ${userId} & hubId: ${hubId}`,
      );
    }

    let hub = await hubRelationship.hub;
    hub.active = false;
    await this.hubRepository.persist(hub);
    return hub;
  }

  private async notifyOfHubActivated(hubId: number) {
    this.logger.log(this.notifyOfHubActivated.name);

    const hubRelationships = await this.joinUserHubRepository.find({
      hubId,
    });

    for (const joinUserHub of hubRelationships) {
      const hub = await joinUserHub.hub;
      await this.notificationService.sendPushToUser(joinUserHub.userId, {
        title: `"${hub.name}" hub became active`,
        body: `Touch to go to hub.`,
        click_action: '',
      } as PushNotificationDto);

      await this.notificationService.addInAppNotificationForUser(
        joinUserHub.userId,
        {
          thumbnail: hub.image,
          header: `"${hub.name}" hub became active`,
          text: `Touch to go to hub.`,
          date: Date.now().toString(),
          actionLink: undefined,
        },
      );
    }
  }
}
