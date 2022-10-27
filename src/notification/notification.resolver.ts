import { Logger, UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Query,
  Resolver,
  ID,
  Directive,
} from '@nestjs/graphql';
import { UserId } from '../decorators/user.decorator';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { InAppNotification } from '../dal/entity/inAppNotification.entity';
import { NotificationService } from './notification.service';
import {
  PageableOptions,
  PaginatedInAppNotificationsResponse,
} from '../dal/pagination/paginatedResponse.helper';

@UseGuards(GqlJwtAuthGuard)
@Resolver()
export class NotificationResolver {
  private logger = new Logger(NotificationResolver.name);

  constructor(private notificationService: NotificationService) {
    this.logger.debug('constructor');
  }

  @Mutation(() => Boolean)
  public async addUserFcmNotificationToken(
    @UserId() userId,
    @Args({ name: 'token', type: () => String }) token: string,
  ): Promise<boolean> {
    this.logger.debug(this.addUserFcmNotificationToken.name);
    await this.notificationService.addUserFcmNotificationToken(userId, token);
    return true;
  }

  @Directive(
    '@deprecated(reason: "This query has been replaced with a new paginated version")',
  )
  @Query(() => [InAppNotification])
  public async getInAppNotifications(
    @UserId() userId,
  ): Promise<InAppNotification[]> {
    this.logger.debug(this.getInAppNotifications.name);
    const [result] = await this.notificationService.getInAppNotifications(
      userId,
    );
    return result;
  }

  @Query(() => PaginatedInAppNotificationsResponse)
  public async paginatedInAppNotifications(
    @UserId() userId,
    @Args('pageableOptions', { nullable: true })
    pageableOptions?: PageableOptions,
  ): Promise<PaginatedInAppNotificationsResponse> {
    this.logger.debug(this.getInAppNotifications.name);
    const [items, total] = await this.notificationService.getInAppNotifications(
      userId,
      pageableOptions,
    );
    return {
      items,
      total,
    };
  }

  @Mutation(() => Boolean)
  public async deleteInAppNotification(
    @UserId() userId,
    @Args({ name: 'inAppNotificationId', type: () => ID })
    inAppNotificationId: number,
  ) {
    this.logger.debug(this.deleteInAppNotification.name);
    await this.notificationService.deleteInAppNotification(
      userId,
      inAppNotificationId,
    );
    return true;
  }

  @Mutation(() => Boolean)
  public async deleteAllInAppNotifications(@UserId() userId) {
    this.logger.debug(this.deleteAllInAppNotifications.name);
    await this.notificationService.deleteAllInAppNotifications(userId);
    return true;
  }
}
