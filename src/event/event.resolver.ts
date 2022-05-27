import { Logger, UseGuards } from '@nestjs/common';
import { Args, Float, Mutation, Resolver } from '@nestjs/graphql';
import { GqlJwtAuthGuard } from 'src/auth/guards/gql-jwt-auth.guard';
import { Event } from 'src/dal/entity/event.entity';
import { JoinUserEvent } from 'src/dal/entity/joinUserEvent.entity';
import { UserId } from 'src/decorators/user.decorator';
import { HubResolver } from 'src/hub/hub.resolver';
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
        @Args({ name: 'allDay', type: () => Boolean, nullable: true }) allDay: boolean,
        @Args({ name: 'startDateTime', type: () => String, nullable: true }) startDateTime: string,
        @Args({ name: 'endDateTime', type: () => String, nullable: true }) endDateTime: string,
        @Args({ name: 'image', type: () => String, nullable: true }) image: string,
        @Args({ name: 'latitude', type: () => Float, nullable: true }) latitude: number,
        @Args({ name: 'longitude', type: () => Float, nullable: true }) longitude: number,
    ): Promise<JoinUserEvent> {
        this.logger.log(this.createEvent.name);
        return this.eventService.createEvent(userId, {
            name,
            description,
            allDay,
            startDateTime,
            endDateTime,
            image,
            latitude,
            longitude,
          } as Event);
    }

}
