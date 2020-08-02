import { Logger, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserId } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/authguard.service';
import { ID } from 'type-graphql';
import { InAppNotification } from '../dal/entity/inAppNotification.entity';
import { NotificationService } from './notification.service';

@Resolver()
export class NotificationResolver {
  private logger = new Logger(NotificationResolver.name, true);

  constructor(private notificationService: NotificationService) {
    this.logger.log('constructor');
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async addUserFcmNotificationToken(
    @UserId() userId,
    @Args({ name: 'token', type: () => String }) token: string,
  ): Promise<boolean> {
    this.logger.log(this.addUserFcmNotificationToken.name);
    await this.notificationService.addUserFcmNotificationToken(userId, token);
    return true;
  }

  @UseGuards(AuthGuard)
  @Query(() => [InAppNotification])
  public async getInAppNotifications(
    @UserId() userId,
  ): Promise<InAppNotification[]> {
    this.logger.log(this.getInAppNotifications.name);
    const usersNotifications = await this.notificationService.getInAppNotifications(
      userId,
    );
    return usersNotifications;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async deleteInAppNotification(
    @UserId() userId,
    @Args({ name: 'inAppNotificationId', type: () => ID })
    inAppNotificationId: number,
  ) {
    this.logger.log(this.deleteInAppNotification.name);
    await this.notificationService.deleteInAppNotification(
      userId,
      inAppNotificationId,
    );
    return true;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  public async deleteAllInAppNotifications(@UserId() userId) {
    this.logger.log(this.deleteAllInAppNotifications.name);
    await this.notificationService.deleteAllInAppNotifications(userId);
    return true;
  }
}
