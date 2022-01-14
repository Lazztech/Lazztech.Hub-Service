import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Logger } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { JoinUserHub } from '../entity/joinUserHub.entity';

@Resolver((of) => JoinUserHub)
export class JoinUserHubsResolver {
  private logger = new Logger(JoinUserHubsResolver.name);

  constructor(
    @InjectRepository(JoinUserHub)
    private joinUserHubRepository: EntityRepository<JoinUserHub>,
  ) {}

  @ResolveField(() => Boolean, { nullable: true })
  async isPresent(@Parent() joinUserHub: JoinUserHub): Promise<boolean> {
    const hub = await joinUserHub.hub.load();
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
}
