import { Logger } from '@nestjs/common';
import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { FileUrlService } from '../../file/file-url/file-url.service';
import { Hub } from '../entity/hub.entity';

@Resolver((of) => Hub)
export class HubFieldResolver {
  private logger = new Logger(HubFieldResolver.name);

  constructor(private readonly fileUrlService: FileUrlService) {}

  @ResolveField(() => String, { nullable: true })
  image(@Parent() hub: Hub, @Context() ctx: any): string {
    return this.fileUrlService.getFileUrl(hub.image, ctx.req);
  }
}
