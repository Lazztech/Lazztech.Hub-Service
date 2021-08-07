import { Logger } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JoinUserHub } from '../entity/joinUserHub.entity';

@Resolver((of) => JoinUserHub)
export class JoinUserHubsResolver {
  private logger = new Logger(JoinUserHubsResolver.name);

  constructor(
    @InjectRepository(JoinUserHub)
    private joinUserHubRepository: Repository<JoinUserHub>,
  ) {}

  @ResolveField(() => Boolean, { nullable: true })
  async isPresent(@Parent() joinUserHub: JoinUserHub): Promise<boolean> {
    const hub = await joinUserHub.hub;
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
