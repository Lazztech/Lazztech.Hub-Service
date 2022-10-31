import { Logger } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UsersByUserIdLoader } from '../dataloaders/users-by-userId.loader';
import { Block } from '../entity/block.entity';
import { User } from '../entity/user.entity';

@Resolver(() => Block)
export class BlockFieldResolver {
  private logger = new Logger(BlockFieldResolver.name);

  constructor(
    private readonly usersByUserIdLoader: UsersByUserIdLoader,
  ) {}

  @ResolveField(() => User)
  from(
    @Parent() parent: Block,
  ): Promise<User> {
    this.logger.debug(this.from.name);
    return this.usersByUserIdLoader.load(parent.from.id);
  }

  @ResolveField(() => User)
  to(
    @Parent() parent: Block,
  ): Promise<User> {
    this.logger.debug(this.to.name);
    return this.usersByUserIdLoader.load(parent.to.id);
  }
}
