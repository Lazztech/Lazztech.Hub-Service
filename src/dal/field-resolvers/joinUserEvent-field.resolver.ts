import { ID, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { EventsByJoinUserEventLoader } from '../dataloaders/events-by-join-user-event.loader';
import { UsersByJoinUserEventLoader } from '../dataloaders/users-by-join-user-event.loader';
import { Event } from '../entity/event.entity';
import { JoinUserEvent } from '../entity/joinUserEvent.entity';
import { User } from '../entity/user.entity';

@Resolver(() => JoinUserEvent)
export class JoinUserEventFieldResolver {

  constructor(
    private readonly eventsByJoinUserEventLoader: EventsByJoinUserEventLoader,
    private readonly usersByJoinUserEventLoader: UsersByJoinUserEventLoader,
  ) {}

  @ResolveField(() => ID)
  public userId(@Parent() joinUserEvent: JoinUserEvent) {
    return joinUserEvent.user.id;
  }

  @ResolveField(() => ID)
  public eventId(@Parent() joinUserEvent: JoinUserEvent) {
    return joinUserEvent.event.id;
  }

  @ResolveField(() => Boolean, { nullable: true })
  async isPresent(@Parent() joinUserEvent: JoinUserEvent): Promise<boolean> {
    return joinUserEvent.isPresent;
  }

  @ResolveField(() => User, { nullable: true })
  public user(@Parent() joinUserEvent: JoinUserEvent): Promise<User> {
    return this.usersByJoinUserEventLoader.load(joinUserEvent.user.id);
  }

  @ResolveField(() => Event, { nullable: true })
  public event(@Parent() joinUserEvent: JoinUserEvent): Promise<Event> {
    return this.eventsByJoinUserEventLoader.load(joinUserEvent.event.id);
  }

}
