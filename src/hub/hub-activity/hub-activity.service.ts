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
    this.logger.debug('constructor');
  }

  async activateHub(userId: any, hubId: number) {
    this.logger.debug(this.activateHub.name);
    const hubRelationship = await this.joinUserHubRepository.findOne({
      user: userId,
      hub: hubId,
      isOwner: true,
    });

    if (!hubRelationship) {
      throw Error(
        `no corresponding hub relationship found for userId: ${userId} & hubId: ${hubId}`,
      );
    }

    const hub = await hubRelationship.hub.load();
    hub.active = true;
    await this.hubRepository.persistAndFlush(hub);

    await this.notifyOfHubActivated(hubId);
    return hub;
  }

  async deactivateHub(userId: any, hubId: number) {
    this.logger.debug(this.deactivateHub.name);
    const hubRelationship = await this.joinUserHubRepository.findOne({
      user: userId,
      hub: hubId,
      isOwner: true,
    });

    if (!hubRelationship) {
      throw Error(
        `no corresponding hub relationship found for userId: ${userId} & hubId: ${hubId}`,
      );
    }

    const hub = await hubRelationship.hub.load();
    hub.active = false;
    await this.hubRepository.persistAndFlush(hub);
    return hub;
  }

  private async notifyOfHubActivated(hubId: number) {
    this.logger.debug(this.notifyOfHubActivated.name);

    const hubRelationships = await this.joinUserHubRepository.find({
      hub: hubId,
    }, {
      populate: ['hub', 'hub.coverImage'],
    });

    for (const joinUserHub of hubRelationships) {
      const hub = await joinUserHub.hub.load();
      await this.notificationService.sendPushToUser(joinUserHub.user.id, {
        title: `"${hub.name}" hub became active`,
        body: `Touch to go to hub.`,
        click_action: '',
      } as PushNotificationDto);

      await this.notificationService.addInAppNotificationForUser(
        joinUserHub.user.id,
        {
          thumbnail: (await hub.coverImage?.load())?.fileName,
          header: `"${hub.name}" hub became active`,
          text: `Touch to go to hub.`,
          date: Date.now().toString(),
          actionLink: undefined,
        },
      );
    }
  }
}
