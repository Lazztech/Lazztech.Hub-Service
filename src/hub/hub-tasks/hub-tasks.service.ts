import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinUserHub } from 'src/dal/entity/joinUserHub.entity';
import { Repository } from 'typeorm';
import { HubGeofenceService } from '../hub-geofence/hub-geofence.service';

@Injectable()
export class HubTasksService {
    private readonly logger = new Logger(HubTasksService.name);

    constructor(
        @InjectRepository(JoinUserHub)
        private joinUserHubRepository: Repository<JoinUserHub>,
        private hubGeofenceService: HubGeofenceService,
    ) {}

    @Cron(CronExpression.EVERY_10_SECONDS)
    async checkoutStalePresentUsers() {
        this.logger.log(this.checkoutStalePresentUsers.name);
        const userHubs = await this.joinUserHubRepository.find({ isPresent: true });
        for (const userHub of userHubs) {
            // get hours diff
            const date1 = new Date(userHub.lastUpdated);
            const date2 = new Date(Date.now());
            const diff = Math.abs(date1.getTime() - date2.getTime()) / 3600000;

            // check if last update was over 2 hours ago
            if (diff > 2) {
                // check out user if there's been no from within 2 hours
                await this.hubGeofenceService.exitedHubGeofence(userHub.userId, userHub.hubId);
                this.logger.log(`checked out user ${userHub.userId} from hub ${userHub.hubId}`);
            }
        }   
    }
}
