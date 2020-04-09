import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/dal/entity/user.entity';
import { Repository } from 'typeorm';
import { Hub } from 'src/dal/entity/hub.entity';
import { NotificationService } from 'src/notification/notification.service';
import { Notification } from 'src/notification/dto/notification.dto';
import { InAppNotification } from 'src/dal/entity/inAppNotification.entity';
import { JoinUserInAppNotifications } from 'src/dal/entity/joinUserInAppNotifications.entity';
import { MicroChat } from 'src/dal/entity/microChat.entity';
import { JoinUserHub } from 'src/dal/entity/joinUserHub.entity';

@Injectable()
export class HubMicroChatService {
    private readonly logger = new Logger(HubMicroChatService.name, true);

    constructor(
        private notificationService: NotificationService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Hub)
        private hubRepository: Repository<Hub>,
        @InjectRepository(InAppNotification)
        private inAppNotificationRepository: Repository<InAppNotification>,
        @InjectRepository(JoinUserInAppNotifications)
        private joinUserInAppNotificationsRepository: Repository<JoinUserInAppNotifications>,
        @InjectRepository(JoinUserHub)
        private joinUserHubRepository: Repository<JoinUserHub>,
        @InjectRepository(MicroChat)
        private microChatRepository: Repository<MicroChat>
    ) { }

    async microChatToHub(userId: number, hubId: number, microChatId: number) {
        this.logger.log(this.microChatToHub.name);

        const fromUser = await this.userRepository.findOne(userId);
        const hub = await this.hubRepository.findOne({
            where: {
                id: hubId,
            },
            relations: ['usersConnection', 'usersConnection.user', 'microChats'],
        });
        const microChat = hub.microChats.find(x => x.id === microChatId);

        const members = await hub.usersConnection;
        for (let index = 0; index < members.length; index++) {
            const memberConnection = members[index];
            await this.notificationService.sendPushToUser(memberConnection.user.id,
                {
                    title: `${microChat.text}`,
                    body: `From ${fromUser.firstName} to the ${hub.name} hub`,
                    click_action: ''
                } as Notification
            );

            const inAppNotification = this.inAppNotificationRepository.create({
                thumbnail: fromUser.image,
                header: `${microChat.text}`,
                text: `From ${fromUser.firstName} to ${hub.name}`,
                date: Date.now().toString(),
            });
            await this.inAppNotificationRepository.save(inAppNotification);

            const joinUserInAppNotification = this.joinUserInAppNotificationsRepository.create(
                {
                    userId: fromUser.id,
                    inAppNotificationId: inAppNotification.id,
                },
            );
            await this.joinUserInAppNotificationsRepository.save(
                joinUserInAppNotification,
            );

            this.logger.log({
                method: this.microChatToHub.name,
                params: [fromUser, hub, microChat],
            });
        }
    }

    async createMicroChat(userId: any, hubId: number, microChatText: string) {
        const usersConnection = await this.joinUserHubRepository.findOne({
            where: {
                userId,
                hubId,
            },
            relations: ['user', 'hub', 'hub.microChats'],
        });

        if (!usersConnection) {
            this.logger.error(
                'No valid relationship found between user and hub for that action.',
            );
        }

        let microChat = new MicroChat();
        microChat.hubId = hubId;
        microChat.text = microChatText;
        microChat = await this.microChatRepository.save(microChat);

        this.logger.log(
            `createMicroChat(userId: ${userId}, hubId: ${hubId}, microChatText: ${microChatText}) completed successfully.`,
        );
        return microChat;
    }

    async deleteMicroChat(userId: number, hubId: number, microChatId: number,) {
        const usersConnection = await this.joinUserHubRepository.findOne({
            where: {
              userId,
              hubId,
            },
            relations: ['user', 'hub', 'hub.microChats'],
          });
      
          if (!usersConnection) {
            this.logger.error(
              'No valid relationship found between user and hub for that action.',
            );
          }
      
          const microChat = usersConnection.hub.microChats.find(
            x => x.id == microChatId,
          );
          await this.microChatRepository.remove(microChat);
      
          this.logger.log(
            `deleteMicroChat(userId: ${userId}, hubId: ${hubId}, microChatId ${microChatId}) completed successfully.`,
          );
    }
}
