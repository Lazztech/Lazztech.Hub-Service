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
  ) {
    this.logger.log('constructor');
  }

  @UseGuards(AuthGuard)
  @Query(() => [InAppNotification])
  public async getInAppNotifications(
    @UserId() userId,
  ): Promise<InAppNotification[]> {
    this.logger.log(this.getInAppNotifications.name);
    const usersNotifications = await this.notificationService.getInAppNotifications(userId);
    return usersNotifications;
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
}
