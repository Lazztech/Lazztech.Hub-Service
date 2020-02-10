import { Injectable } from '@nestjs/common';
import { NotificationService } from 'src/notification/notification.service';
import { JoinUserHub } from 'src/dal/entity/joinUserHub';
import { JoinUserInAppNotifications } from 'src/dal/entity/joinUserInAppNotifications';
import { InAppNotification } from 'src/dal/entity/inAppNotification';

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

                    //TODO change db schema to better support this relationship but normalized.
                    const inAppNotification = InAppNotification.create({
                        thumbnail: element.hub.image,
                        header: `"${element.hub.name}" hub became active`,
                        text: `Touch to go to hub.`,
                        date: Date.now().toString(),
                      });
                      await inAppNotification.save();
                  
                      const joinUserInAppNotification = JoinUserInAppNotifications.create({
                        userId: element.userId,
                        inAppNotificationId: inAppNotification.id,
                      });
                      await joinUserInAppNotification.save();
            }
        }
    }

}
