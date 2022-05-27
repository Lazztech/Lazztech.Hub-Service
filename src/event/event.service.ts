import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Event } from 'src/dal/entity/event.entity';
import { JoinUserEvent, RSVP } from 'src/dal/entity/joinUserEvent.entity';
import { FILE_SERVICE } from 'src/file/file-service.token';
import { FileServiceInterface } from 'src/file/interfaces/file-service.interface';

@Injectable()
export class EventService {
    private readonly logger = new Logger(EventService.name);

    constructor(
        @Inject(FILE_SERVICE)
        private readonly fileService: FileServiceInterface,
        @InjectRepository(JoinUserEvent)
        private readonly joinUserEventRepository: EntityRepository<JoinUserEvent>,
        @InjectRepository(Event)
        private readonly eventRepository: EntityRepository<Event>,
    ) {}

    async createEvent(userId: any, event: Event): Promise<JoinUserEvent> {
        this.logger.log(this.createEvent.name);
        if (event?.image) {
            const imageUrl = await this.fileService.storeImageFromBase64(event.image);
            event.image = imageUrl;
        }

        event = this.eventRepository.create(event);
        await this.eventRepository.persistAndFlush(event);

        const joinUserEvent = this.joinUserEventRepository.create({
            user: userId,
            event: event.id,
            rsvp: RSVP.GOING,
        } as any);
        await this.joinUserEventRepository.persistAndFlush(joinUserEvent);
        return joinUserEvent;
    }

    async getUserEvents(userId: any) {
        this.logger.log(this.getUserEvents.name);
        return await this.joinUserEventRepository.find({ user: userId });
    }
}
