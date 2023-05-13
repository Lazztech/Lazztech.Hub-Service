import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { GeofenceEvent, JoinUserEvent } from '../../dal/entity/joinUserEvent.entity';

@Injectable()
export class EventGeofenceService {
    private readonly logger = new Logger(EventGeofenceService.name);

    constructor(
        @InjectRepository(JoinUserEvent)
        private joinUserEventRepository: EntityRepository<JoinUserEvent>,
    ) {}

    async enteredEventGeofence(userId: any, eventId: number) {
        this.logger.debug(this.enteredEventGeofence.name);
        const eventRelationship = await this.joinUserEventRepository.findOneOrFail({
          user: userId,
          event: eventId,
        });
    
        eventRelationship.lastUpdated = Date.now().toString();
        eventRelationship.lastGeofenceEvent = GeofenceEvent.ENTERED;
    
        if (!eventRelationship.isPresent) {
          eventRelationship.isPresent = true;  
          await this.joinUserEventRepository.persistAndFlush(eventRelationship);
        } else {
          await this.joinUserEventRepository.persistAndFlush(eventRelationship);
        }
    
        return eventRelationship;
    }

    async dwellEventGeofence(userId: any, eventId: number) {
        this.logger.debug(this.dwellEventGeofence.name);
        const eventRelationship = await this.joinUserEventRepository.findOneOrFail({
          user: userId,
          event: eventId,
        });
    
        eventRelationship.lastUpdated = Date.now().toString();
        eventRelationship.lastGeofenceEvent = GeofenceEvent.DWELL;
    
        if (!eventRelationship.isPresent) {
          eventRelationship.isPresent = true;
        }
    
        await this.joinUserEventRepository.persistAndFlush(eventRelationship);
        return eventRelationship;
    }

    async exitedEventGeofence(userId: any, eventId: number) {
        this.logger.debug(this.dwellEventGeofence.name);
        const eventRelationship = await this.joinUserEventRepository.findOneOrFail({
          user: userId,
          event: eventId,
        });
    
        eventRelationship.lastUpdated = Date.now().toString();
        eventRelationship.lastGeofenceEvent = GeofenceEvent.EXITED;
    
        if (eventRelationship.isPresent) {
          eventRelationship.isPresent = false;
          await this.joinUserEventRepository.persistAndFlush(eventRelationship);
        } else {
          await this.joinUserEventRepository.persistAndFlush(eventRelationship);
        }
    
        return eventRelationship;
    }
}
