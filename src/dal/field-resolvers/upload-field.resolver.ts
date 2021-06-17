import { Logger } from '@nestjs/common';
import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { FileUrlService } from '../../file/file-url/file-url.service';
import { Upload } from '../entity/upload.entity';

@Resolver((of) => Upload)
export class UploadFieldResolver {

  constructor(private readonly fileUrlService: FileUrlService) {}

  @ResolveField(() => String, { nullable: true })
  url(@Parent() upload: Upload, @Context() ctx: any): string {
    return this.fileUrlService.getFileUrl(upload.fileName, ctx.req);
  }
}
