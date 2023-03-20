import { Logger } from '@nestjs/common';
import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserId } from '../../decorators/user.decorator';
import { FileUrlService } from '../../file/file-url/file-url.service';
import { BlocksByCompositKeyLoader } from '../dataloaders/blocks-by-compositKey.loader';
import { FilesByFileIdLoader } from '../dataloaders/files-by-fileId.loader';
import { Block } from '../entity/block.entity';
import { File } from '../entity/file.entity';
import { User } from '../entity/user.entity';
import { UserDevice } from '../entity/userDevice.entity';

@Resolver(() => User)
export class UserFieldResolver {
  private logger = new Logger(UserFieldResolver.name);

  constructor(
    private readonly fileUrlService: FileUrlService,
    private readonly blocksByCompositKeyLoader: BlocksByCompositKeyLoader,
    private readonly filesByFileIdLoader: FilesByFileIdLoader,
  ) {}

  @ResolveField(() => File, { nullable: true })
  async profileImage(@Parent() parent: User): Promise<File> {
    return parent?.profileImage?.id && this.filesByFileIdLoader.load(parent.profileImage.id);
  }

  @ResolveField(() => String, { nullable: true })
  async image(@Parent() user: User, @Context() ctx: any): Promise<string> {
    if (user?.profileImage) {
      const coverImage = await this.filesByFileIdLoader.load(user?.profileImage?.id);
      return this.fileUrlService.getFileUrl(coverImage?.fileName, ctx.req);
    }
    return this.fileUrlService.getFileUrl(user?.legacyImage, ctx.req);
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
    const result = await this.blocksByCompositKeyLoader.load({
      from: userId,
      to: parent.id
    });
    return !!result;
  }
}
