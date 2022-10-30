import { Logger } from '@nestjs/common';
import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserId } from '../../decorators/user.decorator';
import { FileUrlService } from '../../file/file-url/file-url.service';
import { BlockedByUserLoader } from '../dataloaders/blocked-by-user.loader';
import { Block } from '../entity/block.entity';
import { User } from '../entity/user.entity';
import { UserDevice } from '../entity/userDevice.entity';

@Resolver(() => User)
export class UserFieldResolver {
  private logger = new Logger(UserFieldResolver.name);

  constructor(
    private readonly fileUrlService: FileUrlService,
    private readonly blockedByUserLoader: BlockedByUserLoader,
  ) {}

  @ResolveField(() => String, { nullable: true })
  image(@Parent() user: User, @Context() ctx: any): string {
    return this.fileUrlService.getFileUrl(user.image, ctx.req);
  }

  @ResolveField(() => [UserDevice], { nullable: true })
  userDevices(
    @UserId() userId,
    @Parent() user: User,
  ): Promise<UserDevice[]> {
    this.logger.debug(this.userDevices.name);
    if (userId === user.id) {
      return user.userDevices.loadItems();
    } else {
      throw new Error('Not allowed to access other users device information');
    }
  }

  @ResolveField(() => [Block], { nullable: true })
  blocks(
    @UserId() userId,
    @Parent() parent: User
  ): Promise<Block[]> {
    this.logger.debug(this.blocks.name);
    if (userId === parent.id) {
      return parent.blocks.loadItems();
    } else {
      throw new Error('Not allowed to access other users blocks');
    }
  }

  @ResolveField(() => Boolean, { nullable: true })
  async blocked(
    @UserId() userId,
    @Parent() parent: User
  ): Promise<boolean> {
    this.logger.debug(this.blocked.name);
    const result = await this.blockedByUserLoader.load({
      from: userId,
      to: parent.id
    });
    console.log(result);
    return !!result;
  }
}
