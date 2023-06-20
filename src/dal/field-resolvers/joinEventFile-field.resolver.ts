import { Logger } from '@nestjs/common';
import { ID, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { EventByEventIdsLoader } from '../dataloaders/events-by-eventIds.loader';
import { FilesByFileIdLoader } from '../dataloaders/files-by-fileId.loader';
import { UsersByUserIdLoader } from '../dataloaders/users-by-userId.loader';
import { Event } from '../entity/event.entity';
import { File } from '../entity/file.entity';
import { JoinEventFile } from '../entity/joinEventFile.entity';
import { User } from '../entity/user.entity';

@Resolver(() => JoinEventFile)
export class JoinEventFileResolver {
  private logger = new Logger(JoinEventFileResolver.name);

  constructor(
    private readonly usersByUserIdLoader: UsersByUserIdLoader,
    private readonly eventsByEventIdLoader: EventByEventIdsLoader,
    private readonly filesByFileIdLoader: FilesByFileIdLoader,
  ) {}

  @ResolveField(() => ID)
  public fileId(@Parent() parent: JoinEventFile) {
    return parent.file.id;
  }

  @ResolveField(() => ID)
  public eventId(@Parent() parent: JoinEventFile) {
    return parent.event.id;
  }

  @ResolveField(() => ID, { nullable: true })
  public approvedByUserId(@Parent() parent: JoinEventFile) {
    return parent.approvedBy?.id;
  }

  @ResolveField(() => File)
  public file(@Parent() parent: JoinEventFile): Promise<File> {
    return this.filesByFileIdLoader.load(parent.file.id);
  }

  @ResolveField(() => Event)
  public event(@Parent() parent: JoinEventFile): Promise<Event> {
    return this.eventsByEventIdLoader.load(parent.event?.id);
  }

  @ResolveField(() => User, { nullable: true })
  public approvedBy(@Parent() parent: JoinEventFile): Promise<User> {
    return parent.approvedBy?.id && this.usersByUserIdLoader.load(parent.approvedBy.id);
  }

  @ResolveField(() => Boolean)
  public approved(@Parent() parent: JoinEventFile): boolean {
    return !!parent.approvedBy?.id;
  }

}
