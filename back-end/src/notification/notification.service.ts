import { Service } from 'typedi';
import { User } from '../dal/entity/user.entity';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PushNotificationDto } from './dto/pushNotification.dto';
import { InAppNotificationDto } from './dto/inAppNotification.dto';
import { InAppNotification } from 'src/dal/entity/inAppNotification.entity';
import { JoinUserInAppNotifications } from 'src/dal/entity/joinUserInAppNotifications.entity';
const fetch = require('node-fetch');

@Service()
export class NotificationService {
  private serverKey: string = this.configService.get<string>(
    'FIREBASE_SERVER_KEY',
  );
  private sendEndpoint: string = this.configService.get<string>(
    'PUSH_NOTIFICATION_ENDPOINT',
  );

  private logger = new Logger(NotificationService.name, true);

  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(InAppNotification)
    private inAppNotificationRepository: Repository<InAppNotification>,
    @InjectRepository(JoinUserInAppNotifications)
    private joinUserInAppNotificationRepository: Repository<JoinUserInAppNotifications>,
  ) {
    this.logger.log('constructor');
  }

  public async addInAppNotificationForUser(userId: number, details: InAppNotificationDto) {
    const inAppNotification = this.inAppNotificationRepository.create(details);
    await this.inAppNotificationRepository.save(inAppNotification);
    const joinUserInAppNotification = this.joinUserInAppNotificationRepository.create({
      userId: userId,
      inAppNotificationId: inAppNotification.id,
    });
    await this.joinUserInAppNotificationRepository.save(joinUserInAppNotification);
  }

  public async sendPushToUser(
    userId: number,
    notification: PushNotificationDto
  ) {
    this.logger.log(this.sendPushToUser.name);

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userDevices'],
    });
    const fcmUserTokens = user.userDevices.map(x => x.fcmPushUserToken);

    for (const iterator of fcmUserTokens) {
      const result = await this.sendPushNotification(notification, iterator);

      this.logger.log(
        `Sent push notification to fcmToken ${
        iterator
        } : ${JSON.stringify(notification)}`,
      );
    }
  }

  public async sendPushNotification(notification: PushNotificationDto, to: string) {
    const result = await fetch(this.sendEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'key=' + this.serverKey,
      },
      body: JSON.stringify({
        notification,
        to
      }),
    });
    return result;
  }
}
