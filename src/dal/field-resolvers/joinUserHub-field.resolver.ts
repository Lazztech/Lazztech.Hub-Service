import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Logger } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Hub } from '../entity/hub.entity';
import { JoinUserHub } from '../entity/joinUserHub.entity';
import { User } from '../entity/user.entity';

@Resolver((of) => JoinUserHub)
export class JoinUserHubsResolver {
  private logger = new Logger(JoinUserHubsResolver.name);

  constructor(
    @InjectRepository(JoinUserHub)
    private joinUserHubRepository: EntityRepository<JoinUserHub>,
    private readonly em: EntityManager,
  ) {}

  @ResolveField(() => Boolean, { nullable: true })
  async isPresent(@Parent() joinUserHub: JoinUserHub): Promise<boolean> {
    const hub = await this.em.getRepository(Hub).findOneOrFail(joinUserHub.hub);
    if (hub.active) {
      return (
        await this.joinUserHubRepository.findOneOrFail({
          userId: joinUserHub.userId,
          hubId: joinUserHub.hubId,
        })
      ).isPresent;
    } else {
      this.logger.warn("Hub must be active to query who's present.");
      return null;
    }
  }

  @ResolveField(() => User)
  public user(@Parent() joinUserHub: JoinUserHub): Promise<User> {
    return this.em.getRepository(User).findOne(joinUserHub.user);
  }

  @ResolveField(() => Hub)
  public hub(@Parent() joinUserHub: JoinUserHub): Promise<Hub> {
    return this.em.getRepository(Hub).findOne(joinUserHub.hub);
  }

}
