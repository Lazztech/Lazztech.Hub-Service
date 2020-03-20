import { Service } from 'typedi';
import { User } from '../dal/entity/user';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
const fetch = require('node-fetch');

@Service()
export class NotificationService {
  private serverKey: string = this.configService.get<string>('FIREBASE_SERVER_KEY');
  private sendEndpoint = 'https://fcm.googleapis.com/fcm/send';

  private logger = new Logger(NotificationService.name);

  constructor(
    private configService: ConfigService
  ) { 
    this.logger.log("constructor");
  }

  public async sendPushToUser(
    userId: number,
    title: string,
    body: string,
    clickAction: string,
  ) {
    this.logger.log(this.sendPushToUser.name);

    const user = await User.findOne({
      where: { id: userId },
      relations: ['userDevices'],
    });
    const fcmUserTokens = [];

    for (const iterator of user.userDevices) {
      fcmUserTokens.push(iterator.fcmPushUserToken);
    }

    for (const iterator of fcmUserTokens) {
      const notification = {
        notification: {
          title,
          body,
          click_action: clickAction,
        },
        to: iterator,
      };

      const result = await fetch(this.sendEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'key=' + this.serverKey,
        },
        body: JSON.stringify(notification),
      });

      console.log(result);
    }
  }
}
