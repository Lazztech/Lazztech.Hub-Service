import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Logger } from '@nestjs/common';
import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserId } from '../../decorators/user.decorator';
import { FileUrlService } from '../../file/file-url/file-url.service';
import { BlocksByUserLoader } from '../dataloaders/blocks-by-user.loader';
import { JoinUserHubsByHubLoader } from '../dataloaders/join-user-hubs-by-hub.loader';
import { Block } from '../entity/block.entity';
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
    private readonly joinUserHubsByHubLoader: JoinUserHubsByHubLoader,
    private readonly blocksByUserLoader: BlocksByUserLoader,
  ) {}

  @ResolveField(() => String, { nullable: true })
  image(@Parent() hub: Hub, @Context() ctx: any): string {
    return this.fileUrlService.getFileUrl(hub.image, ctx.req);
  }

  @ResolveField(() => [JoinUserHub], { nullable: true })
  public async usersConnection(
    @UserId() userId,
    @Parent() parent: Hub,
  ): Promise<JoinUserHub[]> {
    const blocks = await this.blocksByUserLoader.load(userId);
    const usersConnections = await this.joinUserHubsByHubLoader.load(parent.id);
    return usersConnections.filter(joinUserHub => !blocks.find(block => block.from.id === joinUserHub.user.id));    
  }

  @ResolveField(() => [MicroChat], { nullable: true })
  public microChats(@Parent() hub: Hub): Promise<MicroChat[]> {
    return hub.microChats.loadItems();
  }

  @ResolveField(() => [Event], { nullable: true })
  public events(@Parent() parent: Hub): Promise<Event[]> {
    return parent.events?.loadItems();
  }

  @ResolveField(() => [Invite], { nullable: true })
  public invites(@Parent() hub: Hub): Promise<Invite[]> {
    return hub.invites.loadItems();
  }
}
