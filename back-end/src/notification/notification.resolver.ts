import { InAppNotification } from '../dal/entity/inAppNotification';
import { JoinUserInAppNotifications } from '../dal/entity/joinUserInAppNotifications';
import { User } from '../dal/entity/user';
import { UserDevice } from '../dal/entity/userDevice';
import { NotificationService } from './notification.service';
import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { Authorized, Ctx, Arg } from 'type-graphql';
import { AuthGuard } from 'src/guards/authguard.service';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class NotificationResolver {
  constructor(private notificationService: NotificationService) {}

  //@Authorized()
  @UseGuards(AuthGuard)
  @Query(() => [InAppNotification])
  public async getInAppNotifications(
    @Ctx() ctx: any, //FIXME: should be a strongly typed interface
  ): Promise<InAppNotification[]> {
    const joinInAppNotifications = await JoinUserInAppNotifications.find({
      where: { userId: ctx.userId },
      relations: ['inAppNotification'],
    });

    const usersNotifications: InAppNotification[] = [];
    joinInAppNotifications.forEach(element => {
      usersNotifications.push(element.inAppNotification);
    });

    return usersNotifications;
  }

  //@Authorized()
  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async addUserFcmNotificationToken(
    @Ctx() ctx: any, //FIXME: should be a strongly typed interface
    @Arg('token') token: string,
  ): Promise<boolean> {
    const user = await User.findOne({ where: { id: ctx.userId } });

    const userDevice = new UserDevice();
    userDevice.userId = user.id;
    userDevice.fcmPushUserToken = token;
    const result = await userDevice.save();
    console.log(result);

    return true;
  }

  @Query(() => Boolean)
  public async sendPushNotification(@Arg('userId') userId: number) {
    await this.notificationService.sendPushToUser(
      userId,
      'this is a test push message',
      `this is a test push message`,
      '',
    );

    return true;
  }
}
