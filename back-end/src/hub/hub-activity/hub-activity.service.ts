import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hub } from 'src/dal/entity/hub.entity';
import { InAppNotification } from 'src/dal/entity/inAppNotification.entity';
import { JoinUserHub } from 'src/dal/entity/joinUserHub.entity';
import { JoinUserInAppNotifications } from 'src/dal/entity/joinUserInAppNotifications.entity';
import { PushNotificationDto } from 'src/notification/dto/pushNotification.dto';
import { NotificationService } from 'src/notification/notification.service';
import { Repository } from 'typeorm';

@Injectable()
export class HubActivityService {
    private readonly logger = new Logger(HubActivityService.name, true);

    constructor(
        @InjectRepository(JoinUserHub)
        private joinUserHubRepository: Repository<JoinUserHub>,
        @InjectRepository(Hub)
        private hubRepository: Repository<Hub>,
        @InjectRepository(InAppNotification)
        private inAppNotificationRepository: Repository<InAppNotification>,
        @InjectRepository(JoinUserInAppNotifications)
        private joinUserInAppNotificationsRepository: Repository<JoinUserInAppNotifications>,
        private notificationService: NotificationService,
    ) {
        this.logger.log('constructor');
    }

    async activateHub(userId: any, hubId: number) {
        this.logger.log(this.activateHub.name);
        let hubRelationship = await this.joinUserHubRepository.findOne({
            where: {
                userId,
                hubId,
                isOwner: true,
            },
            relations: ['hub'],
        });

        if (!hubRelationship)
            throw Error(
                `no corresponding hub relationship found for userId: ${userId} & hubId: ${hubId}`,
            );

        let hub = hubRelationship.hub;
        hub.active = true;
        hub = await this.hubRepository.save(hub);

        await this.notifyOfHubActivated(hubId);
        return hub;
    }

    async deactivateHub(userId: any, hubId: number) {
        this.logger.log(this.deactivateHub.name);
        let hubRelationship = await this.joinUserHubRepository.findOne({
            where: {
                userId,
                hubId,
                isOwner: true,
            },
            relations: ['hub'],
        });

        if (!hubRelationship)
            throw Error(
                `no corresponding hub relationship found for userId: ${userId} & hubId: ${hubId}`,
            );

        let hub = hubRelationship.hub;
        hub.active = false;
        hub = await this.hubRepository.save(hub);
        return hub;
    }

    private async notifyOfHubActivated(hubId: number) {
        this.logger.log(this.notifyOfHubActivated.name);

        const hubRelationships = await this.joinUserHubRepository.find({
            where: {
                hubId,
            },
            relations: ['hub'],
        });

        for (const joinUserHub of hubRelationships) {
            await this.notificationService.sendPushToUser(
                joinUserHub.userId,
                {
                    title: `"${joinUserHub.hub.name}" hub became active`,
                    body: `Touch to go to hub.`,
                    click_action: '',

                } as PushNotificationDto
            );

            await this.notificationService.addInAppNotificationForUser(
                joinUserHub.userId,
                {
                    thumbnail: joinUserHub.hub.image,
                    header: `"${joinUserHub.hub.name}" hub became active`,
                    text: `Touch to go to hub.`,
                    date: Date.now().toString(),
                    actionLink: undefined
                });
        }
    }
}
