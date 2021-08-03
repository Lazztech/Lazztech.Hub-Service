import { Logger, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, ID } from '@nestjs/graphql';
import { UserId } from '../decorators/user.decorator';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { InAppNotification } from '../dal/entity/inAppNotification.entity';
import { NotificationService } from './notification.service';

@UseGuards(GqlJwtAuthGuard)
@Resolver()
export class NotificationResolver {
  private logger = new Logger(NotificationResolver.name);

  constructor(private notificationService: NotificationService) {
    this.logger.log('constructor');
  }

  @Mutation(() => Boolean)
  public async addUserFcmNotificationToken(
    @UserId() userId,
    @Args({ name: 'token', type: () => String }) token: string,
  ): Promise<boolean> {
    this.logger.log(this.addUserFcmNotificationToken.name);
    await this.notificationService.addUserFcmNotificationToken(userId, token);
    return true;
  }

  @Query(() => [InAppNotification])
  public async getInAppNotifications(
    @UserId() userId,
  ): Promise<InAppNotification[]> {
    this.logger.log(this.getInAppNotifications.name);
    return await this.notificationService.getInAppNotifications(userId);
  }

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

  @Mutation(() => Boolean)
  public async deleteAllInAppNotifications(@UserId() userId) {
    this.logger.log(this.deleteAllInAppNotifications.name);
    await this.notificationService.deleteAllInAppNotifications(userId);
    return true;
  }
}
