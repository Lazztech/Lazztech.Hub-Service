import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hub } from 'src/dal/entity/hub.entity';
import { JoinUserHub } from 'src/dal/entity/joinUserHub.entity';
import { MicroChat } from 'src/dal/entity/microChat.entity';
import { User } from 'src/dal/entity/user.entity';
import { InAppNotificationDto } from 'src/notification/dto/inAppNotification.dto';
import { PushNotificationDto } from 'src/notification/dto/pushNotification.dto';
import { NotificationService } from 'src/notification/notification.service';
import { Repository } from 'typeorm';

@Injectable()
export class HubMicroChatService {
  private readonly logger = new Logger(HubMicroChatService.name, true);

  constructor(
    private notificationService: NotificationService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Hub)
    private hubRepository: Repository<Hub>,
    @InjectRepository(JoinUserHub)
    private joinUserHubRepository: Repository<JoinUserHub>,
    @InjectRepository(MicroChat)
    private microChatRepository: Repository<MicroChat>,
  ) {}

  async microChatToHub(userId: number, hubId: number, microChatId: number) {
    this.logger.log(this.microChatToHub.name);

    const fromUser = await this.userRepository.findOne(userId);
    const hub = await this.hubRepository.findOne({
      id: hubId,
    });
    const microChat = (await hub.microChats).find(x => x.id == microChatId);

    for (const memberConnection of await hub.usersConnection) {
      await this.notificationService.sendPushToUser(memberConnection.userId, {
        title: `${microChat.text}`,
        body: `From ${fromUser.firstName} to the ${hub.name} hub`,
        click_action: '',
      } as PushNotificationDto);

      await this.notificationService.addInAppNotificationForUser(
        memberConnection.userId,
        {
          thumbnail: fromUser.image,
          header: `${microChat.text}`,
          text: `From ${fromUser.firstName} to ${hub.name}`,
          date: Date.now().toString(),
        } as InAppNotificationDto,
      );
    }
  }

  async createMicroChat(userId: any, hubId: number, microChatText: string) {
    this.logger.log(this.createMicroChat.name);
    const usersConnection = await this.joinUserHubRepository.findOne({
      userId,
      hubId,
    });

    if (!usersConnection) {
      this.logger.error(
        'No valid relationship found between user and hub for that action.',
      );
    }

    let microChat = new MicroChat();
    microChat.hubId = hubId;
    microChat.text = microChatText;
    microChat = await this.microChatRepository.save(microChat);

    this.logger.log(
      `createMicroChat(userId: ${userId}, hubId: ${hubId}, microChatText: ${microChatText}) completed successfully.`,
    );
    return microChat;
  }

  async deleteMicroChat(userId: number, hubId: number, microChatId: number) {
    this.logger.log(this.deleteMicroChat.name);
    const usersConnection = await this.joinUserHubRepository.findOne({
      userId,
      hubId,
    });

    if (!usersConnection) {
      this.logger.error(
        'No valid relationship found between user and hub for that action.',
      );
    }

    const microChat = (await (await usersConnection.hub).microChats).find(
      x => x.id == microChatId,
    );
    await this.microChatRepository.remove(microChat);

    this.logger.log(
      `deleteMicroChat(userId: ${userId}, hubId: ${hubId}, microChatId ${microChatId}) completed successfully.`,
    );
  }
}
