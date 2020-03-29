import { Injectable, Logger } from '@nestjs/common';
import { NotificationService } from 'src/notification/notification.service';
import { JoinUserHub } from 'src/dal/entity/joinUserHub.entity';
import { JoinUserInAppNotifications } from 'src/dal/entity/joinUserInAppNotifications.entity';
import { InAppNotification } from 'src/dal/entity/inAppNotification.entity';
import { User } from 'src/dal/entity/user.entity';
import { Hub } from 'src/dal/entity/hub.entity';
import { MicroChat } from 'src/dal/entity/microChat.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class HubService {
  private readonly logger = new Logger(HubService.name, true);
  constructor(
    private notificationService: NotificationService,
    @InjectRepository(InAppNotification)
    private inAppNotificationRepository: Repository<InAppNotification>,
    @InjectRepository(JoinUserInAppNotifications)
    private joinUserInAppNotificationsRepository: Repository<JoinUserInAppNotifications> 
    ) {
    this.logger.log('constructor');
  }

  async notifyOfHubActivated(
    userHubRelationships: JoinUserHub[],
  ) {
    this.logger.log(this.notifyOfHubActivated.name);

    for (let index = 0; index < userHubRelationships.length; index++) {
      const element = userHubRelationships[index];
      await this.notificationService
        .sendPushToUser(
          element.userId,
          `"${element.hub.name}" hub became active`,
          `Touch to go to hub.`,
          '',
        )
        .catch(err => this.logger.error(err));

      //TODO change db schema to better support this relationship but normalized.
      const inAppNotification = this.inAppNotificationRepository.create({
        thumbnail: element.hub.image,
        header: `"${element.hub.name}" hub became active`,
        text: `Touch to go to hub.`,
        date: Date.now().toString(),
      });
      await this.inAppNotificationRepository.save(inAppNotification);

      const joinUserInAppNotification = this.joinUserInAppNotificationsRepository.create({
        userId: element.userId,
        inAppNotificationId: inAppNotification.id,
      });
      await this.joinUserInAppNotificationsRepository.save(joinUserInAppNotification);
    
    }
  }

  async microChatToHub(fromUser: User, hub: Hub, microChat: MicroChat) {
    this.logger.log(this.microChatToHub.name);

    const members = await hub.usersConnection;
    for (let index = 0; index < members.length; index++) {
      const memberConnetion = members[index];
      await this.notificationService
        .sendPushToUser(
          memberConnetion.user.id,
          `${microChat.text}`,
          `From ${fromUser.firstName} to the ${hub.name} hub`,
          '',
        )
        .catch(err => this.logger.error(err));

      const inAppNotification = this.inAppNotificationRepository.create({
        thumbnail: fromUser.image,
        header: `${microChat.text}`,
        text: `From ${fromUser.firstName} to ${hub.name}`,
        date: Date.now().toString(),
      });
      await this.inAppNotificationRepository.save(inAppNotification);

      const joinUserInAppNotification = this.joinUserInAppNotificationsRepository.create({
        userId: fromUser.id,
        inAppNotificationId: inAppNotification.id,
      });
      await this.joinUserInAppNotificationsRepository.save(joinUserInAppNotification);

      this.logger.log({
        method: this.microChatToHub.name,
        params: [fromUser, hub, microChat],
      });
    }
  }
}
