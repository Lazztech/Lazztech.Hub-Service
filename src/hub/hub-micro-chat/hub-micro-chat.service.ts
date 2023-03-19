import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Hub } from '../../dal/entity/hub.entity';
import { JoinUserHub } from '../../dal/entity/joinUserHub.entity';
import { MicroChat } from '../../dal/entity/microChat.entity';
import { User } from '../../dal/entity/user.entity';
import { InAppNotificationDto } from '../../notification/dto/inAppNotification.dto';
import { PushNotificationDto } from '../../notification/dto/pushNotification.dto';
import { NotificationService } from '../../notification/notification.service';

@Injectable()
export class HubMicroChatService {
  private readonly logger = new Logger(HubMicroChatService.name);

  constructor(
    private notificationService: NotificationService,
    @InjectRepository(User)
    private userRepository: EntityRepository<User>,
    @InjectRepository(Hub)
    private hubRepository: EntityRepository<Hub>,
    @InjectRepository(JoinUserHub)
    private joinUserHubRepository: EntityRepository<JoinUserHub>,
    @InjectRepository(MicroChat)
    private microChatRepository: EntityRepository<MicroChat>,
  ) {}

  async microChatToHub(userId: number, hubId: number, microChatId: number) {
    this.logger.debug(this.microChatToHub.name);

    const fromUser = await this.userRepository.findOne(userId, {
      populate: ['profileImage'],
    });
    const hub = await this.hubRepository.findOne({
      id: hubId,
    });
    const microChat = (await hub.microChats.loadItems()).find((x) => x.id == microChatId);

    for (const memberConnection of await hub.usersConnection) {
      await this.notificationService.sendPushToUser(memberConnection.user.id, {
        title: `${microChat.text}`,
        body: `From ${fromUser.firstName} to the ${hub.name} hub`,
        click_action: '',
      } as PushNotificationDto);

      await this.notificationService.addInAppNotificationForUser(
        memberConnection.user.id,
        {
          thumbnail: (await fromUser.profileImage.load())?.fileName,
          header: `${microChat.text}`,
          text: `From ${fromUser.firstName} to ${hub.name}`,
          date: Date.now().toString(),
        } as InAppNotificationDto,
      );
    }
  }

  async createMicroChat(userId: any, hubId: number, microChatText: string) {
    this.logger.debug(this.createMicroChat.name);
    const usersConnection = await this.joinUserHubRepository.findOne({
      user: userId,
      hub: hubId,
    });

    if (!usersConnection) {
      this.logger.error(
        'No valid relationship found between user and hub for that action.',
      );
    }

    const microChat = this.microChatRepository.create({
      hub: {
        id: hubId,
      },
      text: microChatText,
    });
    await this.microChatRepository.persistAndFlush(microChat);

    this.logger.debug(
      `createMicroChat(userId: ${userId}, hubId: ${hubId}, microChatText: ${microChatText}) completed successfully.`,
    );
    return microChat;
  }

  async deleteMicroChat(userId: number, hubId: number, microChatId: number) {
    this.logger.debug(this.deleteMicroChat.name);
    const usersConnection = await this.joinUserHubRepository.findOne({
      user: userId,
      hub: hubId,
    });

    if (!usersConnection) {
      this.logger.error(
        'No valid relationship found between user and hub for that action.',
      );
    }

    const microChat = (await (await usersConnection.hub.load()).microChats.loadItems()).find(
      (x) => x.id == microChatId,
    );
    await this.microChatRepository.removeAndFlush(microChat);

    this.logger.debug(
      `deleteMicroChat(userId: ${userId}, hubId: ${hubId}, microChatId ${microChatId}) completed successfully.`,
    );
  }
}
