import { InAppNotification } from '../dal/entity/inAppNotification.entity';
import { JoinUserInAppNotifications } from '../dal/entity/joinUserInAppNotifications.entity';
import { User } from '../dal/entity/user.entity';
import { UserDevice } from '../dal/entity/userDevice.entity';
import { NotificationService } from './notification.service';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthGuard } from 'src/guards/authguard.service';
import { UseGuards, Logger } from '@nestjs/common';
import { UserId } from 'src/decorators/user.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Resolver()
export class NotificationResolver {
  private logger = new Logger(NotificationResolver.name, true);

  constructor(
    private notificationService: NotificationService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(JoinUserInAppNotifications)
    private joinUserInAppNotificationsRepository: Repository<JoinUserInAppNotifications>,
    @InjectRepository(UserDevice)
    private userDeviceRepository: Repository<UserDevice>
    ) {
    this.logger.log('constructor');
  }

  //@Authorized()
  @UseGuards(AuthGuard)
  @Query(() => [InAppNotification])
  public async getInAppNotifications(
    @UserId() userId,
  ): Promise<InAppNotification[]> {
    this.logger.log(this.getInAppNotifications.name);

    const joinInAppNotifications = await this.joinUserInAppNotificationsRepository.find({
      where: { userId: userId },
      relations: ['inAppNotification'],
    });

    const usersNotifications: InAppNotification[] = [];
    joinInAppNotifications.forEach(element => {
      usersNotifications.push(element.inAppNotification);
    });

    return usersNotifications;
  }

  //FIXME this should be authorized
  //@Authorized()
  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async addUserFcmNotificationToken(
    @UserId() userId,
    @Args({ name: 'token', type: () => String }) token: string,
  ): Promise<boolean> {
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
      this.logger.log(result);
      //TODO notify via email that a new device has been used on the account for security.
    } else {
      this.logger.warn('User device token already stored.');
    }

    return true;
  }

  @Query(() => Boolean)
  public async sendPushNotification(@Args('userId') userId: number) {
    this.logger.log(this.sendPushNotification.name);

    await this.notificationService.sendPushToUser(
      userId,
      'this is a test push message',
      `this is a test push message`,
      '',
    );

    return true;
  }
}
