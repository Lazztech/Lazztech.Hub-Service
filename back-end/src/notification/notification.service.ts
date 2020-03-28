import { Service } from 'typedi';
import { User } from '../dal/entity/user';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
const fetch = require('node-fetch');

@Service()
export class NotificationService {
  private serverKey: string = this.configService.get<string>(
    'FIREBASE_SERVER_KEY',
  );
  private sendEndpoint: string = this.configService.get<string>(
    'PUSH_NOTIFICATION_ENDPOINT',
  );

  private logger = new Logger(NotificationService.name, true);

  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>
    ) {
    this.logger.log('constructor');
  }

  public async sendPushToUser(
    userId: number,
    title: string,
    body: string,
    clickAction: string,
  ) {
    this.logger.log(this.sendPushToUser.name);

    const user = await this.userRepository.findOne({
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

      this.logger.log(
        `Sent push notification to ${
          fcmUserTokens.length
        } devices: ${JSON.stringify(notification)}`,
      );
    }
  }
}
