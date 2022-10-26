import { Logger } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Block } from '../entity/block.entity';
import { User } from '../entity/user.entity';

@Resolver(() => Block)
export class BlockFieldResolver {
  private logger = new Logger(BlockFieldResolver.name);

  @ResolveField(() => User)
  from(
    @Parent() parent: Block,
  ): Promise<User> {
    this.logger.log(this.from.name);
    return parent.from.load();
  }

  @ResolveField(() => User)
  to(
    @Parent() parent: Block,
  ): Promise<User> {
    this.logger.log(this.to.name);
    return parent.to.load();
  }
}
