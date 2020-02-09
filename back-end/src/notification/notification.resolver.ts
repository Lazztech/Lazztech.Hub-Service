import { InAppNotification } from '../dal/entity/inAppNotification';
import { JoinUserInAppNotifications } from '../dal/entity/joinUserInAppNotifications';
import { User } from '../dal/entity/user';
import { UserDevice } from '../dal/entity/userDevice';
import { NotificationService } from './notification.service';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthGuard } from 'src/guards/authguard.service';
import { UseGuards } from '@nestjs/common';
import { UserId } from 'src/decorators/user.decorator';

@Resolver()
export class NotificationResolver {
  constructor(private notificationService: NotificationService) {}

  //@Authorized()
  @UseGuards(AuthGuard)
  @Query(() => [InAppNotification])
  public async getInAppNotifications(
    @UserId() userId,
  ): Promise<InAppNotification[]> {
    const joinInAppNotifications = await JoinUserInAppNotifications.find({
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
    const user = await User.findOne({ 
      where: { id: userId },
      relations: ['userDevices']
    });

    if (!user.userDevices.find(x => x.fcmPushUserToken == token)) {
      const userDevice = new UserDevice();
      userDevice.userId = user.id;
      userDevice.fcmPushUserToken = token;
      const result = await userDevice.save();
      console.log(result);
      //TODO notify via email that a new device has been used on the account for security.
    }
    else {
      console.log('User device token already stored.');
    }

    return true;
  }

  @Query(() => Boolean)
  public async sendPushNotification(@Args('userId') userId: number) {
    await this.notificationService.sendPushToUser(
      userId,
      'this is a test push message',
      `this is a test push message`,
      '',
    );

    return true;
  }
}
