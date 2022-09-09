import { Logger, UseGuards } from '@nestjs/common';
import { Args, Float, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { Event } from '../dal/entity/event.entity';
import { JoinUserEvent } from '../dal/entity/joinUserEvent.entity';
import { UserId } from '../decorators/user.decorator';
import { HubResolver } from '../hub/hub.resolver';
import { EventService } from './event.service';

@UseGuards(GqlJwtAuthGuard)
@Resolver()
export class EventResolver {
    private logger = new Logger(HubResolver.name);

    constructor(
        private readonly eventService: EventService,
    ) {}

    @Mutation(() => JoinUserEvent)
    public async createEvent(
        @UserId() userId,
        @Args({ name: 'name', type: () => String }) name: string,
        @Args({ name: 'description', type: () => String, nullable: true }) description: string,
        @Args({ name: 'startDateTime', type: () => String, nullable: true }) startDateTime: string,
        @Args({ name: 'endDateTime', type: () => String, nullable: true }) endDateTime: string,
        @Args({ name: 'image', type: () => String, nullable: true }) image: string,
        @Args({ name: 'latitude', type: () => Float, nullable: true }) latitude: number,
        @Args({ name: 'longitude', type: () => Float, nullable: true }) longitude: number,
        @Args({ name: 'locationLabel', type: () => String, nullable: true }) locationLabel: string,
    ): Promise<JoinUserEvent> {
        this.logger.log(this.createEvent.name);
        return this.eventService.createEvent(userId, {
            name,
            description,
            startDateTime,
            endDateTime,
            image,
            latitude,
            longitude,
            locationLabel
          } as Event);
    }

    @Mutation(() => JoinUserEvent)
    public async rsvp(
        @UserId() userId,
        @Args({ name: 'eventId', type: () => ID }) eventId: number,
        @Args({ name: 'rsvp', type: () => String, description: 'going || maybe || cantgo' }) rsvp: string,
    ): Promise<JoinUserEvent> {
        this.logger.log(this.rsvp.name);
        return this.eventService.rsvpForEvent(userId, eventId, rsvp);
    }

    @Mutation(() => JoinUserEvent)
    public async inviteUserToEvent(
        @UserId() userId,
        @Args({ name: 'eventId', type: () => ID }) eventId: number,
        @Args({ name: 'inviteesEmail', type: () => String }) inviteesEmail: string,
    ): Promise<JoinUserEvent> {
        this.logger.log(this.inviteUserToEvent.name);
        return this.eventService.inviteUserToEvent(
            userId,
            eventId,
            inviteesEmail,
        );
    }

    @Query(() => JoinUserEvent)
    public async event(
        @UserId() userId,
        @Args({ name: 'id', type: () => ID }) id: number,
    ) {
        this.logger.log(this.event.name);
        try {
            return await this.eventService.getOneUserEvent(userId, id);
        } catch (error) {
            return await this.eventService.joinByShareableLink(userId, id);
        }
    }

    @Mutation(() => JoinUserEvent)
    public async resetShareableEventID(
        @UserId() userId,
        @Args({ name: 'id', type: () => ID }) id: number,
    ) {
        this.logger.log(this.resetShareableEventID.name);
        return this.eventService.resetShareableID(userId, id);
    }

    @Query(() => [JoinUserEvent])
    public async usersEvents(@UserId() userId): Promise<JoinUserEvent[]> {
      this.logger.log(this.usersEvents.name);
      return await this.eventService.getUserEvents(userId);
    }

    @Mutation(() => Boolean)
    public async deleteEvent(
        @UserId() userId,
        @Args({ name: 'id', type: () => ID }) id: number,
    ): Promise<boolean> {
        this.logger.log(this.deleteEvent.name);
        await this.eventService.deleteEvent(userId, id);
        return true;
    }

    @Mutation(() => Event)
    public async updateEvent(
        @UserId() userId,
        @Args({ name: 'eventId', type: () => ID }) eventId: number,
        @Args({ name: 'name', type: () => String }) name: string,
        @Args({ name: 'description', type: () => String, nullable: true }) description: string,
        @Args({ name: 'startDateTime', type: () => String, nullable: true }) startDateTime: string,
        @Args({ name: 'endDateTime', type: () => String, nullable: true }) endDateTime: string,
        @Args({ name: 'image', type: () => String, nullable: true }) image: string,
        @Args({ name: 'latitude', type: () => Float, nullable: true }) latitude: number,
        @Args({ name: 'longitude', type: () => Float, nullable: true }) longitude: number,
        @Args({ name: 'locationLabel', type: () => String, nullable: true }) locationLabel: string,
    ): Promise<Event> {
        this.logger.log(this.updateEvent.name);
        return this.eventService.updateEvent(userId, {
            id: eventId,
            name,
            description,
            startDateTime,
            endDateTime,
            image,
            latitude,
            longitude,
            locationLabel
          } as Event);
    }
}
