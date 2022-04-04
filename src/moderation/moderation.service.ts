import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Hub } from '../dal/entity/hub.entity';
import { JoinUserHub } from '../dal/entity/joinUserHub.entity';
import { User } from '../dal/entity/user.entity';
import { HubService } from '../hub/hub.service';

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
        private hubService: HubService
    ) {}

    @Cron(CronExpression.EVERY_12_HOURS)
    private async autoBanner() {
        this.logger.log(this.autoBanner.name);
        const users = await this.userRepository.find({ flagged: true });
        users.forEach(user => {
            user.banned = true;
        });
        await this.userRepository.persistAndFlush(users);
        const hubs = await this.hubRepository.find({ flagged: true });
        hubs.forEach(hub => {
            hub.banned = true;
        });
        await this.joinUserHubRepository.persistAndFlush(hubs);
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

    public async reportUserAsInappropriate(userId: any, toUserId: number) {
        const commonRelations = await this.hubService.commonUsersHubs(userId, toUserId);
        if (!commonRelations?.length) {
            throw Error('User either does not exist or no common relation could be found.');
        }
        const user = await this.userRepository.findOneOrFail({ id: toUserId });
        user.flagged = true;
        await this.userRepository.persistAndFlush(user);
    }
}
