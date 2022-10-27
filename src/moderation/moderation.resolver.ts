import { Logger, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { UserId } from '../decorators/user.decorator';
import { ModerationService } from './moderation.service';

@UseGuards(GqlJwtAuthGuard)
@Resolver()
export class ModerationResolver {
  private logger = new Logger(ModerationResolver.name);

  constructor(
    private moderationService: ModerationService,
  ) {}

  @Mutation(() => Boolean)
  public async reportHubAsInappropriate(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => ID }) hubId: number,
  ): Promise<boolean> {
    this.logger.debug(this.reportHubAsInappropriate.name);
    await this.moderationService.reportHubAsInappropriate(userId, hubId);
    return true;
  }

  @Mutation(() => Boolean)
  public async reportUserAsInappropriate(
    @UserId() userId,
    @Args({ name: 'toUserId', type: () => ID }) toUserId: number,
  ): Promise<boolean> {
    this.logger.debug(this.reportUserAsInappropriate.name);
    await this.moderationService.reportUserAsInappropriate(userId, toUserId);
    return true;
  }

  @Mutation(() => Boolean)
  public async reportEventAsInappropriate(
    @UserId() userId,
    @Args({ name: 'eventId', type: () => ID }) eventId: number,
  ): Promise<boolean> {
    this.logger.debug(this.reportEventAsInappropriate.name);
    await this.moderationService.reportEventAsInappropriate(userId, eventId);
    return true;
  }
}
