import { Logger } from '@nestjs/common';
import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { FileUrlService } from '../../file/file-url/file-url.service';
import { Hub } from '../entity/hub.entity';
import { Invite } from '../entity/invite.entity';
import { JoinUserHub } from '../entity/joinUserHub.entity';
import { MicroChat } from '../entity/microChat.entity';

@Resolver((of) => Hub)
export class HubFieldResolver {
  private logger = new Logger(HubFieldResolver.name);

  constructor(private readonly fileUrlService: FileUrlService) {}

  @ResolveField(() => String, { nullable: true })
  image(@Parent() hub: Hub, @Context() ctx: any): string {
    return this.fileUrlService.getFileUrl(hub.image, ctx.req);
  }

  @ResolveField(() => [JoinUserHub], { nullable: true })
  public usersConnection(@Parent() hub: Hub): Promise<JoinUserHub[]> {
    return hub.usersConnection.loadItems();
  }

  @ResolveField(() => [MicroChat], { nullable: true })
  public microChats(@Parent() hub: Hub): Promise<MicroChat[]> {
    return hub.microChats.loadItems();
  }

  @ResolveField(() => [Invite], { nullable: true })
  public invites(@Parent() hub: Hub): Promise<Invite[]> {
    return hub.invites.loadItems();
  }
}
