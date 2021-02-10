import { Logger } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { JoinUserHub } from '../entity/joinUserHub.entity';

@Resolver((of) => JoinUserHub)
export class JoinUserHubsResolver {
  private logger = new Logger(JoinUserHubsResolver.name);

  @ResolveField(() => Boolean, { nullable: true })
  async isPresent(@Parent() joinUserHub: JoinUserHub): Promise<boolean> {
    const hub = await joinUserHub.hub;
    if (hub.active) {
      return hub.active;
    } else {
      this.logger.warn("Hub must be active to query who's present.");
      return null;
    }
  }
}
