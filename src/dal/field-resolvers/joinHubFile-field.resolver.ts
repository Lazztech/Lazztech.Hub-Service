import { Logger } from '@nestjs/common';
import { ID, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Hub } from '../entity/hub.entity';
import { JoinHubFile } from '../entity/joinHubFile.entity';
import { User } from '../entity/user.entity';
import { UsersByUserIdLoader } from '../dataloaders/users-by-userId.loader';
import { HubsByHubIdLoader } from '../dataloaders/hubs-by-hubId.loader';
import { FilesByFileIdLoader } from '../dataloaders/files-by-fileId.loader';
import { File } from '../entity/file.entity';

@Resolver(() => JoinHubFile)
export class JoinHubFileResolver {
  private logger = new Logger(JoinHubFileResolver.name);

  constructor(
    private readonly usersByUserIdLoader: UsersByUserIdLoader,
    private readonly hubsByHubIdLoader: HubsByHubIdLoader,
    private readonly filesByFileIdLoader: FilesByFileIdLoader,
  ) {}

  @ResolveField(() => ID)
  public fileId(@Parent() parent: JoinHubFile) {
    return parent.file.id;
  }

  @ResolveField(() => ID)
  public hubId(@Parent() parent: JoinHubFile) {
    return parent.hub.id;
  }

  @ResolveField(() => ID, { nullable: true })
  public approvedByUserId(@Parent() parent: JoinHubFile) {
    return parent.approvedBy?.id;
  }

  @ResolveField(() => File)
  public file(@Parent() parent: JoinHubFile): Promise<File> {
    return this.filesByFileIdLoader.load(parent.file.id);
  }

  @ResolveField(() => Hub)
  public hub(@Parent() parent: JoinHubFile): Promise<Hub> {
    return this.hubsByHubIdLoader.load(parent.hub?.id);
  }

  @ResolveField(() => User, { nullable: true })
  public approvedBy(@Parent() parent: JoinHubFile): Promise<User> {
    return parent.approvedBy?.id && this.usersByUserIdLoader.load(parent.approvedBy.id);
  }

  @ResolveField(() => Boolean)
  public approved(@Parent() parent: JoinHubFile): boolean {
    return !!parent.approvedBy?.id;
  }

}
