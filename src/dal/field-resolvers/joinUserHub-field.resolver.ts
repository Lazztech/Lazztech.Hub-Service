import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Logger } from '@nestjs/common';
import { ID, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Hub } from '../entity/hub.entity';
import { JoinUserHub } from '../entity/joinUserHub.entity';
import { User } from '../entity/user.entity';

@Resolver((of) => JoinUserHub)
export class JoinUserHubsResolver {
  private logger = new Logger(JoinUserHubsResolver.name);

  constructor(
    @InjectRepository(JoinUserHub)
    private joinUserHubRepository: EntityRepository<JoinUserHub>,
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
    const hub = await joinUserHub.hub.load();
    if (hub.active) {
      return joinUserHub.isPresent;
    } else {
      this.logger.warn("Hub must be active to query who's present.");
      return null;
    }
  }

  @ResolveField(() => User)
  public user(@Parent() joinUserHub: JoinUserHub): Promise<User> {
    return joinUserHub.user.load();
  }

  @ResolveField(() => Hub)
  public hub(@Parent() joinUserHub: JoinUserHub): Promise<Hub> {
    return joinUserHub.hub.load();
  }

}
