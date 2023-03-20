import { Logger } from "@nestjs/common";
import { Context, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { FileUrlService } from "../../file/file-url/file-url.service";
import { UsersByUserIdLoader } from "../dataloaders/users-by-userId.loader";
import { File } from "../entity/file.entity";
import { User } from "../entity/user.entity";

@Resolver(() => File)
export class FileFieldResolver {
    private logger = new Logger(FileFieldResolver.name);

    constructor(
        private readonly fileUrlService: FileUrlService,
        private readonly usersByUserIdLoader: UsersByUserIdLoader,
    ) {}

    @ResolveField(() => String, { nullable: true })
    url(@Parent() parent: File, @Context() ctx: any): string {
      return this.fileUrlService.getFileUrl(parent.fileName, ctx.req);
    }

    @ResolveField(() => User)
    createdBy(@Parent() parent: File): Promise<User> {
      return this.usersByUserIdLoader.load(parent.createdBy.id);
    }
}