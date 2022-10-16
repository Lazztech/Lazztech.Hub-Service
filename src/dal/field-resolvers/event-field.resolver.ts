import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserId } from '../../decorators/user.decorator';
import { FileUrlService } from '../../file/file-url/file-url.service';
import { Block } from '../entity/block.entity';
import { Event } from '../entity/event.entity';
import { Hub } from '../entity/hub.entity';
import { JoinUserEvent } from '../entity/joinUserEvent.entity';
import { User } from '../entity/user.entity';

@Resolver((of) => Event)
export class EventFieldResolver {

  constructor(
    private readonly fileUrlService: FileUrlService,
    @InjectRepository(Block)
    private blockRepository: EntityRepository<Block>,
  ) {}

  @ResolveField(() => User, { nullable: true })
  public createdBy(@Parent() parent: Event): Promise<User> {
    return parent.createdBy.load();
  }

  @ResolveField(() => Hub, { nullable: true })
  public hub(@Parent() parent: Event): Promise<Hub> {
    return parent.hub?.load();
  }

  @ResolveField(() => String, { nullable: true })
  image(@Parent() parent: Event, @Context() ctx: any): string {
    return this.fileUrlService.getFileUrl(parent.image, ctx.req);
  }

  @ResolveField(() => [JoinUserEvent], { nullable: true })
  public async usersConnection(
    @UserId() userId,
    @Parent() parent: Event,
  ): Promise<JoinUserEvent[]> {
    const blocks = await this.blockRepository.find({ to: userId });
    const usersConnections = await parent.usersConnection.loadItems();
    return usersConnections.filter(joinUserHub => !blocks.find(block => block.from.id === joinUserHub.user.id));    
  }
}
