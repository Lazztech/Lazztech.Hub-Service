import { Test, TestingModule } from '@nestjs/testing';
import { HubMicroChatService } from './hub-micro-chat.service';
import { User } from 'src/dal/entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hub } from 'src/dal/entity/hub.entity';
import { InAppNotification } from 'src/dal/entity/inAppNotification.entity';
import { JoinUserInAppNotifications } from 'src/dal/entity/joinUserInAppNotifications.entity';
import { JoinUserHub } from 'src/dal/entity/joinUserHub.entity';
import { MicroChat } from 'src/dal/entity/microChat.entity';
import { NotificationService } from 'src/notification/notification.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';

describe('HubMicroChatService', () => {
  let service: HubMicroChatService;
  let joinUserHubRepo: Repository<JoinUserHub>;
  let microChatRepo : Repository<MicroChat>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
      ],
      providers: [
        HubMicroChatService,
        NotificationService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Hub),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(InAppNotification),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(JoinUserInAppNotifications),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(JoinUserHub),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MicroChat),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<HubMicroChatService>(HubMicroChatService);
    joinUserHubRepo = module.get<Repository<JoinUserHub>>(getRepositoryToken(JoinUserHub));
    microChatRepo = module.get<Repository<MicroChat>>(getRepositoryToken(MicroChat));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should resolve for microChatToHub', async () => {
    //TODO
  });

  it('should return for createMicroChat', async () => {
    //Arrange
    const userId = 1;
    const hubId = 1;
    const microChatText = "Hello";
    jest.spyOn(joinUserHubRepo, 'findOne').mockResolvedValueOnce({
      userId,
      hubId,
    } as JoinUserHub);
    const expectResult = {
      hubId,
      text: microChatText
    } as MicroChat;
    const saveCall = jest.spyOn(microChatRepo, 'save').mockResolvedValueOnce(expectResult);
    //Act
    const result = await service.createMicroChat(userId, hubId, microChatText);
    //Assert
    expect(saveCall).toHaveBeenCalled();
    expect(result).toEqual(expectResult);
  });

  it('should resolve for deleteMicroChat', async () => {
    //Arrange
    const userId = 1;
    const hubId = 1;
    const microChatId = 1;
    jest.spyOn(joinUserHubRepo, 'findOne').mockResolvedValueOnce({
      userId,
      hubId,
      hub: {
        microChats: [
          {
            id: microChatId
          },
          {
            id: 2
          }
        ]
      },
      user: {}
    } as JoinUserHub);
    const deleteCall = jest.spyOn(microChatRepo, 'remove').mockResolvedValueOnce({} as MicroChat)
    //Act
    await service.deleteMicroChat(userId, hubId, microChatId);
    //Assert
    expect(deleteCall).toHaveBeenCalled();
  });
});
