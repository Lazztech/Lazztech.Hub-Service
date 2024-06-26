import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { FileUpload } from 'src/file/interfaces/file-upload.interface';
import { v4 as uuid } from 'uuid';
import { Event } from '../dal/entity/event.entity';
import { JoinUserEvent, RSVP } from '../dal/entity/joinUserEvent.entity';
import { User } from '../dal/entity/user.entity';
import { FILE_SERVICE } from '../file/file-service.token';
import { FileServiceInterface } from '../file/interfaces/file-service.interface';
import { NotificationService } from '../notification/notification.service';
import { JoinEventFile } from '../dal/entity/joinEventFile.entity';

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
        @InjectRepository(JoinEventFile)
        private readonly joinEventFileRepository: EntityRepository<JoinEventFile>,
        private readonly notificationService: NotificationService,
    ) {}

    async uploadEventFiles(userId: any, eventId: any, files: [Promise<FileUpload>]): Promise<JoinUserEvent> {
        const joinUserEvent = await this.joinUserEventRepository.findOneOrFail({ 
            user: userId, event: eventId
        }, { populate: ['event'] });
        const createdById = (await joinUserEvent.event.load()).createdBy.id;
        const storedFiles = await Promise.all(files.map(file => this.fileService.storeImageFromFileUpload(file, userId)));
        const fileEntities = storedFiles.map(file => {
            return this.joinEventFileRepository.create({
              event: eventId,
              approvedBy: createdById === userId ? userId : undefined,
              file: file.id,
            });
          });
        
        await this.joinEventFileRepository.persistAndFlush(fileEntities);
        return joinUserEvent;
    }

    async createEvent(userId: any, event: Event, image?: Promise<FileUpload>): Promise<JoinUserEvent> {
        this.logger.debug(this.createEvent.name);
        if ((event?.maximumCapacity <= event?.minimumCapacity)) {
            throw Error('Maximum capacity must be greater than minimum capacity.');
        }
        if (image) {
            const imageFile = await this.fileService.storeImageFromFileUpload(image, userId);
            event.coverImage = imageFile as any;
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
        this.logger.debug(this.rsvpForEvent.name);
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

        const user = await userEvent.user.load();
        const event = await userEvent.event.load();
        await this.notificationService.sendPushToUser(event.createdBy.id, {
            title: `${(user.firstName || user.username)} RSVP'd ${rsvp}.`,
            body: `to ${event.name}`,
            click_action: `event/${eventId}`,
        });

        return userEvent;
    }

    async inviteUserToEvent(userId: any, eventId: number, inviteesEmail: string, inviteesShareableId: string): Promise<JoinUserEvent> {
        // fetch by either inviteesShareableId or else inviteesEmail if inviteesShareableId is undefined
        const invitee = await this.userRepository.findOneOrFail(
            inviteesShareableId ? { shareableId: inviteesShareableId } : { email: inviteesEmail }
        );
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

    async removeUserFromEvent(userId: any, eventId: any, otherUsersId: any) {
        this.logger.debug(this.removeUserFromEvent.name);
        if (userId == otherUsersId) {
            throw new Error(
              `You cannot delete your relationship to the event as an owner.`,
            );
          }
        const join = await this.joinUserEventRepository.findOneOrFail(
            { event: eventId, user: otherUsersId },
            { populate: ['event', 'event.createdBy'] }
        );
        const event = await join.event.load();
        const createdBy = await event.createdBy.load();
        if (createdBy.id !== userId) {
            throw new Error('Only the event creater may remove people');
        }
        await this.joinUserEventRepository.removeAndFlush(join);
    }

    async getOneUserEvent(userId: any, eventId: number) {
        this.logger.debug(this.getOneUserEvent.name);
        return await this.joinUserEventRepository.findOneOrFail({
            user: userId,
            event: eventId,
        });
    }

    async joinByShareableLink(userId: any, shareableId: any) {
        this.logger.debug(this.joinByShareableLink.name);
        const event = await this.eventRepository.findOneOrFail({ shareableId });
        try {
            return await this.joinUserEventRepository.findOneOrFail({ event, user: userId });
        } catch (error) {
            const joinUserEvent = this.joinUserEventRepository.create({
                user: userId,
                event: event.id,
                isPresent: false,
            });
            await this.joinUserEventRepository.persistAndFlush(joinUserEvent);
    
            await event.createdBy.load();
            await this.notificationService.sendPushToUser(event?.createdBy?.id, {
                title: `You're invited to "${event.name}" event.`,
                body: `View the invite.`,
                click_action: `event/${event?.id}`,
            });
    
            return joinUserEvent;   
        }
    }

    async resetShareableID(userId: any, eventId: number) {
        this.logger.debug(this.resetShareableID.name);
        const userEvent = await this.joinUserEventRepository.findOneOrFail({ user: userId, event: eventId });
        const event = await userEvent.event.load();
        const createdBy = await event?.createdBy.load();
        if (createdBy?.id != userId) {
            throw new Error('Only the event creator can reset the shareable ID');
        }
        event.shareableId = uuid();
        this.eventRepository.persistAndFlush(event);
        return userEvent;
    }

    async getUserEvents(userId: any) {
        this.logger.debug(this.getUserEvents.name);
        return this.joinUserEventRepository.find({ user: userId }, {
            orderBy: {
                event: {
                    startDateTime: QueryOrder.DESC
                }
            }
        });
    }

    async updateEvent(userId: any, value: Event, image?: Promise<FileUpload>): Promise<Event> {
        this.logger.debug(this.updateEvent.name);
        if ((value?.maximumCapacity <= value?.minimumCapacity)) {
            throw Error('Maximum capacity must be greater than minimum capacity.');
        }
        let event = await this.eventRepository.findOneOrFail({
            createdBy: userId,
            id: value.id
        }, {
            populate: ['coverImage']
        }) as Event;
        if (image) {
            if (value?.coverImage) {
                await this.fileService.delete((await value?.coverImage.load()).fileName).catch(err => this.logger.warn(err));
            }
            const imageFile = await this.fileService.storeImageFromFileUpload(image, userId);
            value.coverImage = imageFile as any;
        }

        event = this.eventRepository.assign(event, value);
        await this.eventRepository.persistAndFlush(event);
        return event;
    }

    async deleteEvent(userId: any, eventId: number) {
        this.logger.debug(this.deleteEvent.name);
        const event = await this.eventRepository.findOneOrFail({
            createdBy: userId,
            id: eventId
        });
        await this.eventRepository.removeAndFlush(event);
    }
}
