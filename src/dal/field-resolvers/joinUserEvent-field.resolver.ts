import { ID, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Event } from '../entity/event.entity';
import { JoinUserEvent } from '../entity/joinUserEvent.entity';
import { User } from '../entity/user.entity';

@Resolver((of) => JoinUserEvent)
export class JoinUserEventFieldResolver {
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
    const event = await joinUserEvent.event.load();
    return joinUserEvent.isPresent;
  }

  @ResolveField(() => User, { nullable: true })
  public user(@Parent() joinUserEvent: JoinUserEvent): Promise<User> {
    return joinUserEvent.user.load();
  }

  @ResolveField(() => Event, { nullable: true })
  public event(@Parent() joinUserEvent: JoinUserEvent): Promise<Event> {
    return joinUserEvent.event.load();
  }

}
