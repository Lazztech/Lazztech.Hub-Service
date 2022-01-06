import { Service } from 'typedi';
import { User } from '../dal/entity/user.entity';
import { ConfigService } from '@nestjs/config';
import { Logger, HttpService } from '@nestjs/common';
import { PushNotificationDto } from './dto/pushNotification.dto';
import { InAppNotificationDto } from './dto/inAppNotification.dto';
import { UserDevice } from '../dal/entity/userDevice.entity';
import { InAppNotification } from '../dal/entity/inAppNotification.entity';
import {
  generateOrderOptions,
  PageableOptions,
} from '../dal/pagination/paginatedResponse.helper';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

@Service()
export class NotificationService {
  private serverKey: string = this.configService.get<string>(
    'FIREBASE_SERVER_KEY',
  );
  private sendEndpoint: string = this.configService.get<string>(
    'PUSH_NOTIFICATION_ENDPOINT',
  );

  private logger = new Logger(NotificationService.name);

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    @InjectRepository(User)
    private userRepository: EntityRepository<User>,
    @InjectRepository(InAppNotification)
    private inAppNotificationRepository: EntityRepository<InAppNotification>,
    @InjectRepository(UserDevice)
    private userDeviceRepository: EntityRepository<UserDevice>,
  ) {
    this.logger.log('constructor');
  }

  public async addUserFcmNotificationToken(
    userId: any,
    token: string,
  ): Promise<void> {
    this.logger.log(this.addUserFcmNotificationToken.name);
    const user = await this.userRepository.findOne({ id: userId });

    if (!(await user.userDevices).find((x) => x.fcmPushUserToken == token)) {
      const userDevice = new UserDevice();
      userDevice.userId = user.id;
      userDevice.fcmPushUserToken = token;
      await this.userDeviceRepository.persist(userDevice);
      // TODO notify via email that a new device has been used on the account for security.
    } else {
      this.logger.warn('User device token already stored.');
    }
  }

  /**
   * Fetch a users in app notifications, with optional pagination
   * @param userId users id
   * @param limit max limit of how many items to fetch
   * @param offset items from zero to start from
   * @returns promise of array of in app notifications
   */
  public async getInAppNotifications(
    userId: any,
    pageableOptions?: PageableOptions,
  ): Promise<[InAppNotification[], number]> {
    this.logger.log(this.getInAppNotifications.name);
    return await this.inAppNotificationRepository.findAndCount({ userId }, {
      limit: pageableOptions?.limit,
      offset: pageableOptions?.offset,
      orderBy: generateOrderOptions(pageableOptions?.sortOptions),
    })
  }

  public async addInAppNotificationForUser(
    userId: number,
    details: InAppNotificationDto,
  ): Promise<void> {
    this.logger.log(this.addInAppNotificationForUser.name);
    const inAppNotification = this.inAppNotificationRepository.create({
      ...details,
      userId,
    });
    await this.inAppNotificationRepository.persist(inAppNotification);
  }

  async deleteInAppNotification(
    userId: any,
    inAppNotificationId: number,
  ): Promise<void> {
    this.logger.log(this.deleteInAppNotification.name);
    const inAppNotification = await this.inAppNotificationRepository.findOne({
      id: inAppNotificationId,
      userId,
    });
    await this.inAppNotificationRepository.remove(inAppNotification);
  }

  async deleteAllInAppNotifications(userId: any): Promise<void> {
    this.logger.log(this.deleteAllInAppNotifications.name);
    const inAppNotifications = await this.inAppNotificationRepository.find({
      userId,
    });
    await this.inAppNotificationRepository.remove(inAppNotifications);
  }

  public async sendPushToUser(
    userId: number,
    notification: PushNotificationDto,
  ): Promise<void> {
    this.logger.log(this.sendPushToUser.name);

    const user = await this.userRepository.findOne({ id: userId });
    const fcmUserTokens = (await user.userDevices).map(
      (x) => x.fcmPushUserToken,
    );

    this.logger.log(
      `${fcmUserTokens.length} push notification tokens found for userId: ${userId}`,
    );

    for (const iterator of fcmUserTokens) {
      await this.sendPushNotification(notification, iterator);

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
      .toPromise()
      .catch((e) => this.logger.log(e));

    return result;
  }
}
