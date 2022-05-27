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
        @Args({ name: 'description', type: () => String }) description: string,
        @Args({ name: 'image', type: () => String }) image: string,
        @Args({ name: 'latitude', type: () => Float }) latitude: number,
        @Args({ name: 'longitude', type: () => Float }) longitude: number,
    ): Promise<JoinUserEvent> {
        this.logger.log(this.createEvent.name);
        return this.eventService.createEvent(userId, {
            name,
            description,
            image,
            latitude,
            longitude,
          } as Event);
    }

}
