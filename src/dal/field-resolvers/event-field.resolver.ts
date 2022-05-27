import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { FileUrlService } from '../../file/file-url/file-url.service';
import { Event } from '../entity/event.entity';

@Resolver((of) => Event)
export class EventFieldResolver {

  constructor(
    private readonly fileUrlService: FileUrlService,
  ) {}

  @ResolveField(() => String, { nullable: true })
  image(@Parent() parent: Event, @Context() ctx: any): string {
    return this.fileUrlService.getFileUrl(parent.image, ctx.req);
  }
}
