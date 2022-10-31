import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Event } from '../entity/event.entity';

@Injectable({ scope: Scope.REQUEST })
export class EventByEventIdsLoader extends DataLoader<number, Event> {
    private logger = new Logger(EventByEventIdsLoader.name);

    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: EntityRepository<Event>
    ) {
        super(keys => this.batchLoadFn(keys));
    }

    private async batchLoadFn(eventIds: readonly number[]): Promise<Event[]> {
        this.logger.debug(eventIds);
        const events = await this.eventRepository.find(eventIds as number[]);
        const map: { [key: string]: Event } = {};
        events.forEach(event => {
            map[event.id] = event;
        });
        return eventIds.map(key => map[key]);
    }

}
