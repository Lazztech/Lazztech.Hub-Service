import { Logger } from "@nestjs/common";
import { Context, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { FileUrlService } from "src/file/file-url/file-url.service";
import { File } from "../entity/file.entity";

@Resolver(() => File)
export class FileFieldResolver {
    private logger = new Logger(FileFieldResolver.name);

    constructor(
        private readonly fileUrlService: FileUrlService,
    ) {}

    @ResolveField(() => String, { nullable: true })
    url(@Parent() parent: File, @Context() ctx: any): string {
      return this.fileUrlService.getFileUrl(parent.fileName, ctx.req);
    }
}