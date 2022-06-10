import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from '../dal/entity/user.entity';
import { NotificationService } from '../notification/notification.service';
import { Event } from '../dal/entity/event.entity';
import { JoinUserEvent, RSVP } from '../dal/entity/joinUserEvent.entity';
import { FILE_SERVICE } from '../file/file-service.token';
import { FileServiceInterface } from '../file/interfaces/file-service.interface';

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
        @InjectRepository(User)
        private readonly userRepository: EntityRepository<User>,
        private readonly notificationService: NotificationService,
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
        this.logger.log(this.rsvpForEvent.name);
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

    async inviteUserToEvent(userId: any, eventId: number, inviteesEmail: string): Promise<JoinUserEvent> {
        const invitee = await this.userRepository.findOneOrFail({ email: inviteesEmail });
        const event = await this.eventRepository.findOneOrFail({ id: eventId });

        const joinUserEvent = this.joinUserEventRepository.create({
            user: invitee.id,
            event: event.id,
            isPresent: false,
        });
        await this.joinUserEventRepository.persistAndFlush(joinUserEvent);

        await this.notificationService.sendPushToUser(invitee.id, {
            title: `You're invited to "${event.name}" event.`,
            body: `View the invite.`,
            click_action: `event/${eventId}`,
        });
        return joinUserEvent;
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

    async updateEvent(userId: any, value: Event): Promise<Event> {
        this.logger.log(this.updateEvent.name);
        let event = await this.eventRepository.findOneOrFail({
            createdBy: userId,
            id: value.id
        });
        if (value?.image && value?.image?.includes('base64')) {
            const imageUrl = await this.fileService.storeImageFromBase64(value.image);
            value.image = imageUrl;
        } else {
            delete value?.image;
        }

        event = this.eventRepository.assign(event, value);
        await this.eventRepository.persistAndFlush(event);
        return event;
    }

    async deleteEvent(userId: any, eventId: number) {
        this.logger.log(this.deleteEvent.name);
        const event = await this.eventRepository.findOneOrFail({
            createdBy: userId,
            id: eventId
        });
        await this.eventRepository.removeAndFlush(event);
    }
}
