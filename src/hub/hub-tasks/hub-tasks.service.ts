import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { JoinUserHub } from '../../dal/entity/joinUserHub.entity';
import { HubGeofenceService } from '../hub-geofence/hub-geofence.service';

@Injectable()
export class HubTasksService {
    private readonly logger = new Logger(HubTasksService.name);

    constructor(
        @InjectRepository(JoinUserHub)
        private joinUserHubRepository: EntityRepository<JoinUserHub>,
        private hubGeofenceService: HubGeofenceService,
    ) {}

    @Cron(CronExpression.EVERY_30_MINUTES)
    async checkoutStalePresentUsers() {
        this.logger.debug(this.checkoutStalePresentUsers.name);
        const userHubs = await this.joinUserHubRepository.find({ isPresent: true });
        for (const userHub of userHubs) {
            // get hours diff
            const date1 = new Date(Number(userHub?.lastUpdated) || null);
            const date2 = new Date();
            const diff = Math.abs(date1.getTime() - date2.getTime()) / 3600000;

            // check hours elapsed sinse last updated
            if (diff > 48) {
                // check out user if there's no updates within the desired elapsed time
                await this.hubGeofenceService.exitedHubGeofence(userHub.user.id, userHub.hub.id);
                this.logger.debug(`checked out user ${userHub.user.id} from hub ${userHub.hub.id}`);
            }
        }   
    }
}
