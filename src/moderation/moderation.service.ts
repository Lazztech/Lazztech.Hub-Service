import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Event } from '../dal/entity/event.entity';
import { JoinUserEvent } from '../dal/entity/joinUserEvent.entity';
import { Hub } from '../dal/entity/hub.entity';
import { JoinUserHub } from '../dal/entity/joinUserHub.entity';
import { User } from '../dal/entity/user.entity';
import { HubService } from '../hub/hub.service';
import { File } from 'src/dal/entity/file.entity';

@Injectable()
export class ModerationService {
    private logger = new Logger(ModerationService.name);

    constructor(
        @InjectRepository(Hub)
        private hubRepository: EntityRepository<Hub>,
        @InjectRepository(JoinUserHub)
        private joinUserHubRepository: EntityRepository<JoinUserHub>,
        @InjectRepository(User)
        private userRepository: EntityRepository<User>,
        @InjectRepository(Event)
        private eventRepository: EntityRepository<Event>,
        @InjectRepository(JoinUserEvent)
        private joinUserEventRepository: EntityRepository<JoinUserEvent>,
        @InjectRepository(File)
        private readonly fileRepository: EntityRepository<File>,
        private hubService: HubService
    ) {}

    @Cron(CronExpression.EVERY_12_HOURS)
    private async autoBanner() {
        this.logger.debug(this.autoBanner.name);
        // mark users
        const users = await this.userRepository.find({ flagged: true });
        users.forEach(user => {
            user.banned = true;
        });
        await this.userRepository.persistAndFlush(users);

        // mark hubs
        const hubs = await this.hubRepository.find({ flagged: true });
        hubs.forEach(hub => {
            hub.banned = true;
        });
        await this.joinUserHubRepository.persistAndFlush(hubs);

        // mark events
        const events = await this.eventRepository.find({ flagged: true });
        events.forEach(event => {
            event.banned  = true;
        });
        await this.eventRepository.persistAndFlush(events);

        // mark files
        const files = await this.fileRepository.find({ flagged: true });
        files.forEach(file => {
            file.banned = true;
        });
        await this.fileRepository.persistAndFlush(files);
    }

    public async reportHubAsInappropriate(userId: any, hubId: number) {
        const relation = await this.joinUserHubRepository.findOneOrFail({
            user: userId,
            hub: hubId
        });
        if (!relation) {
            throw Error('Hub either does not exist or no common relation could be found');
        }
        const hub = await relation.hub.load();
        hub.flagged = true;
        const adminRelations = await this.joinUserHubRepository.find({ hub: hubId, isOwner: true });
        for (const ownerRelation of adminRelations) {
            const owner = await ownerRelation.user.load();
            owner.flagged = true;
        }
        await this.joinUserHubRepository.persistAndFlush(adminRelations);
        await this.hubRepository.persistAndFlush(hub);
    }

    async reportEventAsInappropriate(userId: any, eventId: number) {
        const relation = await this.joinUserEventRepository.findOneOrFail({
            user: userId,
            event: eventId,
        });
        const event = await relation.event.load();
        event.flagged = true;
        const createdByUser = await event.createdBy.load();
        createdByUser.flagged = true;
        await this.joinUserEventRepository.persistAndFlush(event);
        await this.userRepository.persistAndFlush(createdByUser);
      }

    public async reportUserAsInappropriate(userId: any, toUserId: number) {
        const commonRelations = await this.hubService.commonUsersHubs(userId, toUserId);
        if (!commonRelations?.length) {
            throw Error('User either does not exist or no common relation could be found.');
        }
        const user = await this.userRepository.findOneOrFail({ id: toUserId });
        user.flagged = true;
        await this.userRepository.persistAndFlush(user);
    }

    public async reportFileAsInappropriate(userId: any, fileName: any) {
        const file = await this.fileRepository.findOneOrFail({
            fileName
        });
        file.flagged = true;
        await this.fileRepository.persistAndFlush(file);
    }
}
