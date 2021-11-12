import { Logger, UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Query,
  Resolver,
  ID,
  Int,
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

  @Directive(
    '@deprecated(reason: "This query has been replaced with a new paginated version")',
  )
  @Query(() => [InAppNotification])
  public async getInAppNotifications(
    @UserId() userId,
    @Args({ name: 'limit', type: () => Int, nullable: true }) limit: number,
    @Args({ name: 'offset', type: () => Int, nullable: true }) offset: number,
  ): Promise<InAppNotification[]> {
    this.logger.log(this.getInAppNotifications.name);
    const [result] = await this.notificationService.getInAppNotifications(
      userId,
      limit,
      offset,
    );
    return result;
  }

  @Query(() => PaginatedInAppNotificationsResponse)
  public async paginatedInAppNotifications(
    @UserId() userId,
    @Args('pageableOptions', { nullable: true }) pageableOptions?: PageableOptions,
  ): Promise<PaginatedInAppNotificationsResponse> {
    this.logger.log(this.getInAppNotifications.name);
    const [items, total] = await this.notificationService.getInAppNotifications(
      userId,
      pageableOptions?.limit,
      pageableOptions?.offset,
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
