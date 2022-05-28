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

        event = this.eventRepository.create({ ...event, createdBy: userId });
        await this.eventRepository.persistAndFlush(event);

        const joinUserEvent = this.joinUserEventRepository.create({
            user: userId,
            event: event.id,
            rsvp: RSVP.GOING,
        } as any);
        await this.joinUserEventRepository.persistAndFlush(joinUserEvent);
        return joinUserEvent;
    }

    async rsvpForEvent(userId: any, eventId: any, rsvp: any) {
        switch (rsvp) {
            case RSVP.GOING:
                break;
            case RSVP.CANTGO:
                break;
            case RSVP.MAYBE:
                break;
            default:
                throw new Error('rsvp must be going, maybe, or cantgo.');
        }

        const userEvent = await this.joinUserEventRepository.findOneOrFail({
            user: userId,
            event: eventId,
        });
        userEvent.rsvp = rsvp;
        await this.joinUserEventRepository.persistAndFlush(userEvent);
        return userEvent;
    }

    async getOneUserEvent(userId: any, eventId: number) {
        this.logger.log(this.getOneUserEvent.name);
        return await this.joinUserEventRepository.findOne({
            user: userId,
            event: eventId,
        });
    }

    async getUserEvents(userId: any) {
        this.logger.log(this.getUserEvents.name);
        return await this.joinUserEventRepository.find({ user: userId });
    }
}
