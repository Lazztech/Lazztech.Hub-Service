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
  public reportHubAsInappropriate(
    @UserId() userId,
    @Args({ name: 'hubId', type: () => ID }) hubId: number,
  ) {
    this.logger.log(this.reportHubAsInappropriate.name);
    return this.moderationService.reportHubAsInappropriate(userId, hubId);
  }

  @Mutation(() => Boolean)
  public reportUserAsInappropriate(
    @UserId() userId,
    @Args({ name: 'toUserId', type: () => ID }) toUserId: number,
  ) {
    this.logger.log(this.reportUserAsInappropriate.name);
    return this.moderationService.reportUserAsInappropriate(userId, toUserId);
  }
}
