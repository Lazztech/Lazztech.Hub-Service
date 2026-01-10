import { EntityManager, EntityRepository, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { FileUpload } from 'src/file/interfaces/file-upload.interface';
import { v4 as uuid } from 'uuid';
import { Event } from '../dal/entity/event.entity';
import { JoinUserEvent, RSVP } from '../dal/entity/joinUserEvent.entity';
import { User } from '../dal/entity/user.entity';
import { NotificationService } from '../notification/notification.service';
import { JoinEventFile } from '../dal/entity/joinEventFile.entity';
import { FileService } from '../file/file-service.abstract';

@Injectable()
export class EventService {
    private readonly logger = new Logger(EventService.name);

    constructor(
        @Inject()
        private readonly fileService: FileService,
        @InjectRepository(JoinUserEvent)
        private readonly joinUserEventRepository: EntityRepository<JoinUserEvent>,
        @InjectRepository(Event)
        private readonly eventRepository: EntityRepository<Event>,
        @InjectRepository(User)
        private readonly userRepository: EntityRepository<User>,
        @InjectRepository(JoinEventFile)
        private readonly joinEventFileRepository: EntityRepository<JoinEventFile>,
        private readonly notificationService: NotificationService,
        private readonly em: EntityManager,
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
        
        await this.em.persist(fileEntities).flush();
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
        await this.em.persist(event).flush();

        const joinUserEvent = this.joinUserEventRepository.create({
            user: userId,
            event: event.id,
            rsvp: RSVP.GOING,
        } as any);
        await this.em.persist(joinUserEvent).flush();
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
        await this.em.persist(userEvent).flush();

        const user = await userEvent.user.load();
        const event = await userEvent.event.load();
        await this.notificationService.sendPushToUser(event.createdBy.id, {
            title: `${(user.firstName || user.username)} RSVP'd ${rsvp}.`,
            body: `to ${event.name}`,
            click_action: `https://noun.lazz.tech/app/tabs/event/${eventId}`,
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
        await this.em.persist(joinUserEvent).flush();

        await this.notificationService.sendPushToUser(invitee.id, {
            title: `You're invited to "${event.name}" event.`,
            body: `View the invite.`,
            click_action: `https://noun.lazz.tech/app/tabs/event/${eventId}`,
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
        await this.em.remove(join).flush();
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
            await this.em.persist(joinUserEvent).flush();
    
            await event.createdBy.load();
            await this.notificationService.sendPushToUser(event?.createdBy?.id, {
                title: `You're invited to "${event.name}" event.`,
                body: `View the invite.`,
                click_action: `https://noun.lazz.tech/app/tabs/event/${event?.id}`,
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
        await this.em.persist(event).flush();
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
        await this.em.persist(event).flush();
  
        const createdById = event.createdBy.id;
        
        const joins = await this.joinUserEventRepository.find(
            { event, user: { $ne: createdById } },
            { populate: ['user'] } );

        joins.forEach(j => 
            this.notificationService.sendPushToUser(
                j.user.id,
                    { title: `"${event.name}" has been updated`,
                    body: `View the event to see changes.`,
                    click_action: `https://noun.lazz.tech/app/tabs/event/${event?.id}`,
                    }
                )
            );
        
        return event;
    }

    async deleteEvent(userId: any, eventId: number) {
        this.logger.debug(this.deleteEvent.name);
        const event = await this.eventRepository.findOneOrFail({
            createdBy: userId,
            id: eventId
        });
        await this.em.remove(event).flush();
    }
}
