import { Context, Float, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserId } from '../../decorators/user.decorator';
import { FileUrlService } from '../../file/file-url/file-url.service';
import { BlocksByUserLoader } from '../dataloaders/blocks-by-user.loader';
import { FilesByFileIdLoader } from '../dataloaders/files-by-fileId.loader';
import { UsersByUserIdLoader } from '../dataloaders/users-by-userId.loader';
import { Event } from '../entity/event.entity';
import { File } from '../entity/file.entity';
import { Hub } from '../entity/hub.entity';
import { JoinUserEvent } from '../entity/joinUserEvent.entity';
import { User } from '../entity/user.entity';
import { HubsByHubIdLoader } from '../dataloaders/hubs-by-hubId.loader';

@Resolver(() => Event)
export class EventFieldResolver {

  constructor(
    private readonly fileUrlService: FileUrlService,
    private readonly usersByUserIdLoader: UsersByUserIdLoader,
    private readonly filesByFileIdLoader: FilesByFileIdLoader,
    private readonly blocksByUserLoader: BlocksByUserLoader,
    private readonly hubsByHubIdLoader: HubsByHubIdLoader,
  ) {}

  @ResolveField(() => User, { nullable: true })
  public createdBy(@Parent() parent: Event): Promise<User> {
    return this.usersByUserIdLoader.load(parent.createdBy.id);
  }

  @ResolveField(() => Float, { nullable: true, description: 'Returns from Hub if available, or else value from Event is returned' })
  public async latitude(@Parent() parent: Event): Promise<number> {
    if (parent.hub?.id) {
      return this.hubsByHubIdLoader.load(parent.hub?.id).then(x => x.latitude);
    }
    return parent.latitude;
  }

  @ResolveField(() => Float, { nullable: true, description: 'Returns from Hub if available, or else value from Event is returned' })
  public async longitude(@Parent() parent: Event): Promise<number> {
    if (parent.hub?.id) {
      return this.hubsByHubIdLoader.load(parent.hub?.id).then(x => x.longitude);
    }
    return parent.longitude;
  }

  @ResolveField(() => String, { nullable: true, description: 'Returns value from Hub if available, or else value from Event is returned' })
  public async locationLabel(@Parent() parent: Event): Promise<string> {
    if (parent.hub?.id) {
      return this.hubsByHubIdLoader.load(parent.hub?.id).then(x => x.locationLabel);
    }
    return parent.locationLabel;
  }

  @ResolveField(() => Hub, { nullable: true })
  public hub(@Parent() parent: Event): Promise<Hub> {
    if (parent.hub?.id) {
      return this.hubsByHubIdLoader.load(parent.hub?.id);
    }
  }

  @ResolveField(() => File, { nullable: true })
  public async coverImage(@Parent() parent: Event): Promise<File> {
    return parent?.coverImage?.id && this.filesByFileIdLoader.load(parent.coverImage.id);
  }

  @ResolveField(() => String, { nullable: true })
  async image(@Parent() parent: Event, @Context() ctx: any): Promise<string> {
    if (parent.coverImage) {
      const coverImage = await this.filesByFileIdLoader.load(parent?.coverImage?.id);
      return this.fileUrlService.getFileUrl(coverImage?.fileName, ctx.req);
    }
  }

  @ResolveField(() => [JoinUserEvent], { nullable: true })
  public async usersConnection(
    @UserId() userId,
    @Parent() parent: Event,
  ): Promise<JoinUserEvent[]> {
    const blocks = await this.blocksByUserLoader.load(userId);
    const usersConnections = await parent.usersConnection.loadItems();
    return usersConnections.filter(joinUserHub => !blocks?.find(block => block.from.id === joinUserHub.user.id));    
  }
}
