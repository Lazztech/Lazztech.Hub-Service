import { Logger } from '@nestjs/common';
import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserId } from '../../decorators/user.decorator';
import { FileUrlService } from '../../file/file-url/file-url.service';
import { Block } from '../entity/block.entity';
import { User } from '../entity/user.entity';
import { UserDevice } from '../entity/userDevice.entity';

@Resolver((of) => User)
export class UserFieldResolver {
  private logger = new Logger(UserFieldResolver.name);

  constructor(
    private readonly fileUrlService: FileUrlService,
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
    this.logger.log(this.userDevices.name);
    if (userId === user.id) {
      return user.userDevices.loadItems();
    } else {
      throw new Error('Not allowed to access other users device information');
    }
  }

  @ResolveField(() => [Block], { nullable: true })
  blocks(@Parent() parent: User): Promise<Block[]> {
    this.logger.log(this.blocks.name);
    return parent.blocks.loadItems();
  }
}
