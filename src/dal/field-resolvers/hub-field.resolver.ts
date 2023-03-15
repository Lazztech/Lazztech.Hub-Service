import { QueryOrder } from '@mikro-orm/core';
import { Logger } from '@nestjs/common';
import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserId } from '../../decorators/user.decorator';
import { FileUrlService } from '../../file/file-url/file-url.service';
import { BlocksByUserLoader } from '../dataloaders/blocks-by-user.loader';
import { JoinUserHubsByHubIdsLoader } from '../dataloaders/joinUserHubs-by-hubIds.loader';
import { Event } from '../entity/event.entity';
import { Hub } from '../entity/hub.entity';
import { Invite } from '../entity/invite.entity';
import { JoinUserHub } from '../entity/joinUserHub.entity';
import { MicroChat } from '../entity/microChat.entity';

@Resolver(() => Hub)
export class HubFieldResolver {
  private logger = new Logger(HubFieldResolver.name);

  constructor(
    private readonly fileUrlService: FileUrlService,
    private readonly joinUserHubsByHubLoader: JoinUserHubsByHubIdsLoader,
    private readonly blocksByUserLoader: BlocksByUserLoader,
  ) {}

  @ResolveField(() => String, { nullable: true })
  async image(@Parent() hub: Hub, @Context() ctx: any): Promise<string> {
    const coverImage = await hub.coverImage.load();
    return this.fileUrlService.getFileUrl(coverImage.fileName, ctx.req);
  }

  @ResolveField(() => [JoinUserHub], { nullable: true })
  public async usersConnection(
    @UserId() userId,
    @Parent() parent: Hub,
  ): Promise<JoinUserHub[]> {
    const blocks = await this.blocksByUserLoader.load(userId);
    const usersConnections = await this.joinUserHubsByHubLoader.load(parent.id);
    return usersConnections.filter(joinUserHub => !blocks?.find(block => block.from.id === joinUserHub.user.id)); 
  }

  @ResolveField(() => [MicroChat], { nullable: true })
  public microChats(@Parent() hub: Hub): Promise<MicroChat[]> {
    return hub.microChats.loadItems();
  }

  @ResolveField(() => [Event], { nullable: true })
  public async events(@UserId() userId, @Parent() parent: Hub): Promise<Event[]> {
    // should only show events that the current use is invited to
    const events = await parent.events?.init({
      where: {
        usersConnection: {
          user: userId
        }
      },
      orderBy: {
        startDateTime: QueryOrder.DESC
      }
    });
    return events.loadItems();
  }

  @ResolveField(() => [Invite], { nullable: true })
  public invites(@Parent() hub: Hub): Promise<Invite[]> {
    return hub.invites.loadItems();
  }
}
