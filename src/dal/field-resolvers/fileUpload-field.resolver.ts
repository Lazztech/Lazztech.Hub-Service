import { Logger } from "@nestjs/common";
import { Context, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { FileUrlService } from "src/file/file-url/file-url.service";
import { FileUpload } from "../entity/fileUpload.entity";

@Resolver(() => FileUpload)
export class FileUploadFieldResolver {
    private logger = new Logger(FileUploadFieldResolver.name);

    constructor(
        private readonly fileUrlService: FileUrlService,
    ) {}

    @ResolveField(() => String, { nullable: true })
    url(@Parent() parent: FileUpload, @Context() ctx: any): string {
      return this.fileUrlService.getFileUrl(parent.fileName, ctx.req);
    }
}