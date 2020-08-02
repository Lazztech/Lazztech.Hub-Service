import { Service } from 'typedi';
import { User } from '../dal/entity/user.entity';
import { ConfigService } from '@nestjs/config';
import { Logger, HttpService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PushNotificationDto } from './dto/pushNotification.dto';
import { InAppNotificationDto } from './dto/inAppNotification.dto';
import { InAppNotification } from 'src/dal/entity/inAppNotification.entity';
import { JoinUserInAppNotifications } from 'src/dal/entity/joinUserInAppNotifications.entity';
import { UserDevice } from 'src/dal/entity/userDevice.entity';

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
    private httpService: HttpService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(InAppNotification)
    private inAppNotificationRepository: Repository<InAppNotification>,
    @InjectRepository(JoinUserInAppNotifications)
    private joinUserInAppNotificationRepository: Repository<
      JoinUserInAppNotifications
    >,
    @InjectRepository(UserDevice)
    private userDeviceRepository: Repository<UserDevice>,
  ) {
    this.logger.log('constructor');
  }

  public async addUserFcmNotificationToken(userId: any, token: string) {
    this.logger.log(this.addUserFcmNotificationToken.name);
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userDevices'],
    });

    if (!user.userDevices.find(x => x.fcmPushUserToken == token)) {
      const userDevice = new UserDevice();
      userDevice.userId = user.id;
      userDevice.fcmPushUserToken = token;
      const result = await this.userDeviceRepository.save(userDevice);
      // TODO notify via email that a new device has been used on the account for security.
    } else {
      this.logger.warn('User device token already stored.');
    }
  }

  public async getInAppNotifications(userId: any) {
    this.logger.log(this.getInAppNotifications.name);
    const joinInAppNotifications = await this.joinUserInAppNotificationRepository.find(
      {
        where: { userId },
        relations: ['inAppNotification'],
      },
    );

    const usersNotifications: InAppNotification[] = [];
    joinInAppNotifications.forEach(element => {
      usersNotifications.push(element.inAppNotification);
    });

    return usersNotifications;
  }

  public async addInAppNotificationForUser(
    userId: number,
    details: InAppNotificationDto,
  ) {
    this.logger.log(this.addInAppNotificationForUser.name);
    const inAppNotification = this.inAppNotificationRepository.create(details);
    await this.inAppNotificationRepository.save(inAppNotification);
    const joinUserInAppNotification = this.joinUserInAppNotificationRepository.create(
      {
        userId,
        inAppNotificationId: inAppNotification.id,
      },
    );
    await this.joinUserInAppNotificationRepository.save(
      joinUserInAppNotification,
    );
  }

  async deleteInAppNotification(userId: any, inAppNotificationId: number) {
    this.logger.log(this.deleteInAppNotification.name);
    const inAppRelationship = await this.joinUserInAppNotificationRepository.findOne(
      {
        userId,
        inAppNotificationId,
      },
    );
    await this.joinUserInAppNotificationRepository.remove(inAppRelationship);
  }

  async deleteAllInAppNotifications(userId: any) {
    this.logger.log(this.deleteAllInAppNotifications.name);
    const inAppRelationships = await this.joinUserInAppNotificationRepository.find(
      {
        userId,
      },
    );
    await this.joinUserInAppNotificationRepository.remove(inAppRelationships);
  }

  public async sendPushToUser(
    userId: number,
    notification: PushNotificationDto,
  ) {
    this.logger.log(this.sendPushToUser.name);

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userDevices'],
    });
    const fcmUserTokens = user.userDevices.map(x => x.fcmPushUserToken);

    for (const iterator of fcmUserTokens) {
      const result = await this.sendPushNotification(notification, iterator);

      this.logger.log(`Sent push notification to fcmToken ${iterator}`);
    }
  }

  private async sendPushNotification(
    notification: PushNotificationDto,
    to: string,
  ) {
    this.logger.log(this.sendPushNotification.name);
    const data = {
      notification,
      to,
    };
    const result = await this.httpService
      .post(this.sendEndpoint, data, {
        headers: {
          Authorization: 'key=' + this.serverKey,
        },
      })
      .toPromise();

    return result;
  }
}
