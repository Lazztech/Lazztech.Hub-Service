import { Logger } from '@nestjs/common';
import { ID, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { HubsByHubIdLoader } from '../dataloaders/hubs-by-hubId.loader';
import { UsersByUserIdLoader } from '../dataloaders/users-by-userId.loader';
import { Hub } from '../entity/hub.entity';
import { JoinUserHub } from '../entity/joinUserHub.entity';
import { User } from '../entity/user.entity';

@Resolver(() => JoinUserHub)
export class JoinUserHubsResolver {
  private logger = new Logger(JoinUserHubsResolver.name);

  constructor(
    private readonly hubsByJoinUserHubLoader: HubsByHubIdLoader,
    private readonly usersByUserIdLoader: UsersByUserIdLoader,
  ) {}

  @ResolveField(() => ID)
  public userId(@Parent() joinUserHub: JoinUserHub) {
    return joinUserHub.user.id;
  }

  @ResolveField(() => ID)
  public hubId(@Parent() joinUserHub: JoinUserHub) {
    return joinUserHub.hub.id;
  }

  @ResolveField(() => Boolean, { nullable: true })
  async isPresent(@Parent() joinUserHub: JoinUserHub): Promise<boolean> {
    const hub = await this.hubsByJoinUserHubLoader.load(joinUserHub.hub?.id);
    if (hub.active) {
      return joinUserHub.isPresent;
    } else {
      return null;
    }
  }

  @ResolveField(() => User, { nullable: true })
  public user(@Parent() joinUserHub: JoinUserHub): Promise<User> {
    return this.usersByUserIdLoader.load(joinUserHub.user.id);
  }

  @ResolveField(() => Hub, { nullable: true })
  public hub(@Parent() joinUserHub: JoinUserHub): Promise<Hub> {
    return this.hubsByJoinUserHubLoader.load(joinUserHub.hub?.id);
  }

}
