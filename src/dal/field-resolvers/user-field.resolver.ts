import { Logger } from '@nestjs/common';
import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { FileUrlService } from '../../file/file-url/file-url.service';
import { User } from '../entity/user.entity';

@Resolver((of) => User)
export class UserFieldResolver {
  private logger = new Logger(UserFieldResolver.name);

  constructor(private readonly fileUrlService: FileUrlService) {}

  @ResolveField(() => String, { nullable: true })
  image(@Parent() user: User, @Context() ctx: any): string {
    return this.fileUrlService.getFileUrl(user.image, ctx.req);
  }
}
