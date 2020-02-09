import { Injectable } from '@nestjs/common';
import { NotificationService } from 'src/notification/notification.service';
import { JoinUserHub } from 'src/dal/entity/joinUserHub';

@Injectable()
export class HubService {

    constructor(
        private notificationService: NotificationService
    ) {}

    async notifyOfHubActivated(userHubRelationships: JoinUserHub[], except?: JoinUserHub[]) {
        for (let index = 0; index < userHubRelationships.length; index++) {
            const element = userHubRelationships[index];
            if (except) {
                //TODO
            } else {
                await this.notificationService.sendPushToUser(
                    element.userId,
                    `"${element.hub.name}" hub became active`,
                    `Touch to go to hub.`,
                    ""
                    ).catch(err => console.error(err));
            }
        }
    }

}
