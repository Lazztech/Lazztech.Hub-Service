import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { FileUrlService } from '../../file/file-url/file-url.service';
import { InAppNotification } from '../entity/inAppNotification.entity';

@Resolver((of) => InAppNotification)
export class InAppNotificationFieldResolver {
  constructor(private readonly fileUrlService: FileUrlService) {}

  @ResolveField(() => String, { nullable: true })
  thumbnail(
    @Parent() inAppNotification: InAppNotification,
    @Context() ctx: any,
  ): string {
    return this.fileUrlService.getFileUrl(inAppNotification.thumbnail, ctx.req);
  }
}
