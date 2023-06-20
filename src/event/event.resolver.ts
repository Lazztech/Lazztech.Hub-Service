import { Logger, UseGuards } from '@nestjs/common';
import { Args, Float, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlJwtAuthGuard } from '../auth/guards/gql-jwt-auth.guard';
import { Event } from '../dal/entity/event.entity';
import { JoinUserEvent } from '../dal/entity/joinUserEvent.entity';
import { UserId } from '../decorators/user.decorator';
import { EventService } from './event.service';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from 'src/file/interfaces/file-upload.interface';
import { EventGeofenceService } from './event-geofence/event-geofence.service';

@UseGuards(GqlJwtAuthGuard)
@Resolver()
export class EventResolver {
    private logger = new Logger(EventResolver.name);

    constructor(
        private readonly eventService: EventService,
        private readonly eventGeofenceService: EventGeofenceService,
    ) {}

    @Mutation(() => JoinUserEvent)
    public async createEvent(
        @UserId() userId,
        @Args({ name: 'name', type: () => String }) name: string,
        @Args({ name: 'description', type: () => String, nullable: true }) description: string,
        @Args({ name: 'startDateTime', type: () => String, nullable: true }) startDateTime: string,
        @Args({ name: 'minimumCapacity', type: () => Int, nullable: true }) minimumCapacity: number,
        @Args({ name: 'maximumCapacity', type: () => Int, nullable: true }) maximumCapacity: number,
        @Args({ name: 'endDateTime', type: () => String, nullable: true }) endDateTime: string,
        @Args({ name: 'hubId', type: () => String, nullable: true }) hubId: any,
        @Args({ name: 'latitude', type: () => Float, nullable: true }) latitude: number,
        @Args({ name: 'longitude', type: () => Float, nullable: true }) longitude: number,
        @Args({ name: 'locationLabel', type: () => String, nullable: true }) locationLabel: string,
        @Args({ name: 'imageFile', nullable: true, type: () => GraphQLUpload }) imageFile: Promise<FileUpload>,
    ): Promise<JoinUserEvent> {
        this.logger.debug(this.createEvent.name);
        return this.eventService.createEvent(userId, {
            name,
            description,
            startDateTime,
            endDateTime,
            minimumCapacity,
            maximumCapacity,
            hub: hubId,
            latitude,
            longitude,
            locationLabel
          } as Event, imageFile);
    }

    @Mutation(() => JoinUserEvent)
    public async uploadEventFiles(
        @UserId() userId,
        @Args({ name: 'eventId', type: () => ID }) eventId: number,
        @Args({ name: 'files', nullable: true, type: () => [GraphQLUpload] }) files: [Promise<FileUpload>],
    ): Promise<JoinUserEvent> {
        this.logger.debug(this.uploadEventFiles.name);
        return this.eventService.uploadEventFiles(userId, eventId, files);
    }

    @Mutation(() => JoinUserEvent)
    public async rsvp(
        @UserId() userId,
        @Args({ name: 'eventId', type: () => ID }) eventId: number,
        @Args({ name: 'rsvp', type: () => String, description: 'going || maybe || cantgo' }) rsvp: string,
    ): Promise<JoinUserEvent> {
        this.logger.debug(this.rsvp.name);
        return this.eventService.rsvpForEvent(userId, eventId, rsvp);
    }

    @Mutation(() => JoinUserEvent)
    public async inviteUserToEvent(
        @UserId() userId,
        @Args({ name: 'eventId', type: () => ID }) eventId: number,
        @Args({ name: 'inviteesEmail', type: () => String, nullable: true }) inviteesEmail?: string,
        @Args({ name: 'inviteesShareableId', type: () => String, nullable: true }) inviteesShareableId?: string,
    ): Promise<JoinUserEvent> {
        this.logger.debug(this.inviteUserToEvent.name);
        return this.eventService.inviteUserToEvent(
            userId,
            eventId,
            inviteesEmail,
            inviteesShareableId,
        );
    }

    @Mutation(() => Boolean)
    public async removeUserFromEvent(
        @UserId() userId,
        @Args({ name: 'eventId', type: () => ID }) eventId: number,
        @Args({ name: 'otherUsersId', type: () => ID }) otherUsersId: number,
    ): Promise<boolean> {
        this.logger.debug(this.removeUserFromEvent.name);
        await this.eventService.removeUserFromEvent(
            userId,
            eventId,
            otherUsersId
        );
        return true;
    }

    @Query(() => JoinUserEvent)
    public async event(
        @UserId() userId,
        @Args({ name: 'id', type: () => ID }) id: number,
    ) {
        this.logger.debug(this.event.name);
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
        this.logger.debug(this.resetShareableEventID.name);
        return this.eventService.resetShareableID(userId, id);
    }

    @Query(() => [JoinUserEvent])
    public async usersEvents(@UserId() userId): Promise<JoinUserEvent[]> {
      this.logger.debug(this.usersEvents.name);
      return await this.eventService.getUserEvents(userId);
    }

    @Mutation(() => Boolean)
    public async deleteEvent(
        @UserId() userId,
        @Args({ name: 'id', type: () => ID }) id: number,
    ): Promise<boolean> {
        this.logger.debug(this.deleteEvent.name);
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
        @Args({ name: 'minimumCapacity', type: () => Int, nullable: true }) minimumCapacity: number,
        @Args({ name: 'maximumCapacity', type: () => Int, nullable: true }) maximumCapacity: number,
        @Args({ name: 'hubId', type: () => String, nullable: true }) hubId: any,
        @Args({ name: 'latitude', type: () => Float, nullable: true }) latitude: number,
        @Args({ name: 'longitude', type: () => Float, nullable: true }) longitude: number,
        @Args({ name: 'locationLabel', type: () => String, nullable: true }) locationLabel: string,
        @Args({ name: 'imageFile', nullable: true, type: () => GraphQLUpload }) imageFile: Promise<FileUpload>,
    ): Promise<Event> {
        this.logger.debug(this.updateEvent.name);
        return this.eventService.updateEvent(userId, {
            id: eventId,
            name,
            description,
            startDateTime,
            endDateTime,
            minimumCapacity,
            maximumCapacity,
            hub: hubId,
            latitude,
            longitude,
            locationLabel
          } as Event, imageFile);
    }

    @Mutation(() => JoinUserEvent)
    public async enteredEventGeofence(
      @UserId() userId,
      @Args({ name: 'eventId', type: () => ID }) eventId: number,
    ): Promise<JoinUserEvent> {
      this.logger.debug(this.enteredEventGeofence.name);
      return await this.eventGeofenceService.enteredEventGeofence(userId, eventId);
    }
  
    @Mutation(() => JoinUserEvent)
    public async dwellEventGeofence(
      @UserId() userId,
      @Args({ name: 'eventId', type: () => ID }) eventId: number,
    ): Promise<JoinUserEvent> {
      this.logger.debug(this.dwellEventGeofence.name);
      return await this.eventGeofenceService.dwellEventGeofence(userId, eventId);
    }
  
    @Mutation(() => JoinUserEvent)
    public async exitedEventGeofence(
      @UserId() userId,
      @Args({ name: 'eventId', type: () => ID }) eventId: number,
    ): Promise<JoinUserEvent> {
      this.logger.debug(this.exitedEventGeofence.name);
      return await this.eventGeofenceService.exitedEventGeofence(userId, eventId);
    }
}
