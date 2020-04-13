import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinUserHub } from 'src/dal/entity/joinUserHub.entity';
import { Repository } from 'typeorm';
import { Hub } from 'src/dal/entity/hub.entity';
import { NotificationService } from 'src/notification/notification.service';
import { InAppNotification } from 'src/dal/entity/inAppNotification.entity';
import { JoinUserInAppNotifications } from 'src/dal/entity/joinUserInAppNotifications.entity';
import { PushNotificationDto } from 'src/notification/dto/pushNotification.dto';

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

        for (let index = 0; index < hubRelationships.length; index++) {
            const element = hubRelationships[index];
            await this.notificationService
                .sendPushToUser(
                    element.userId,
                    {
                        title: `"${element.hub.name}" hub became active`,
                        body: `Touch to go to hub.`,
                        click_action: '',

                    } as PushNotificationDto
                );

            //TODO change db schema to better support this relationship but normalized.
            const inAppNotification = this.inAppNotificationRepository.create({
                thumbnail: element.hub.image,
                header: `"${element.hub.name}" hub became active`,
                text: `Touch to go to hub.`,
                date: Date.now().toString(),
            });
            await this.inAppNotificationRepository.save(inAppNotification);

            const joinUserInAppNotification = this.joinUserInAppNotificationsRepository.create(
                {
                    userId: element.userId,
                    inAppNotificationId: inAppNotification.id,
                },
            );
            await this.joinUserInAppNotificationsRepository.save(
                joinUserInAppNotification,
            );
        }
    }
}
