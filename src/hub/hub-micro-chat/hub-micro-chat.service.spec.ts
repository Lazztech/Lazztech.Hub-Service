import { Test, TestingModule } from '@nestjs/testing';
import { HubMicroChatService } from './hub-micro-chat.service';
import { User } from '../../dal/entity/user.entity';
import { Hub } from '../../dal/entity/hub.entity';
import { InAppNotification } from '../../dal/entity/inAppNotification.entity';
import { JoinUserHub } from '../../dal/entity/joinUserHub.entity';
import { MicroChat } from '../../dal/entity/microChat.entity';
import { NotificationService } from '../../notification/notification.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { UserDevice } from '../../dal/entity/userDevice.entity';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

describe('HubMicroChatService', () => {
  let service: HubMicroChatService;
  let joinUserHubRepo: EntityRepository<JoinUserHub>;
  let microChatRepo: EntityRepository<MicroChat>;
  let userRepo: EntityRepository<User>;
  let hubRepo: EntityRepository<Hub>;
  let notificationService: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.local', '.env'],
          isGlobal: true,
        }),
        HttpModule,
      ],
      providers: [
        HubMicroChatService,
        NotificationService,
        {
          provide: getRepositoryToken(User),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(Hub),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(InAppNotification),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(JoinUserHub),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(MicroChat),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(UserDevice),
          useClass: EntityRepository,
        },
      ],
    }).compile();

    service = module.get<HubMicroChatService>(HubMicroChatService);
    joinUserHubRepo = module.get<EntityRepository<JoinUserHub>>(
      getRepositoryToken(JoinUserHub),
    );
    microChatRepo = module.get<EntityRepository<MicroChat>>(
      getRepositoryToken(MicroChat),
    );
    userRepo = module.get<EntityRepository<User>>(getRepositoryToken(User));
    hubRepo = module.get<EntityRepository<Hub>>(getRepositoryToken(Hub));
    notificationService = module.get(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should resolve for microChatToHub', async () => {
    // Arrange
    const userId = 1;
    const hubId = 1;
    const microChatId = 1;
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce({
      id: userId,
      firstName: 'Gian',
      profileImage: { load: jest.fn().mockResolvedValueOnce({ fileName: 'image.png' })} ,
    } as any);
    jest.spyOn(hubRepo, 'findOne').mockResolvedValueOnce({
      id: hubId,
      name: 'TestHubName',
      usersConnection: [
        {
          user: { id: userId },
        },
        {
          user: { id: 2 },
        },
        {
          user: { id: 3 },
        },
      ] as any,
      microChats: {
        loadItems: jest.fn().mockResolvedValueOnce([
          {
            id: microChatId,
          },
        ] as any)
      } as any,
    } as any);
    const sendPushToUserCall = jest
      .spyOn(notificationService, 'sendPushToUser')
      .mockImplementation(() => Promise.resolve());
    const addInAppNotificationForUserCall = jest
      .spyOn(notificationService, 'addInAppNotificationForUser')
      .mockImplementation(() => Promise.resolve());
    // Act
    await service.microChatToHub(userId, hubId, microChatId);
    // Assert
    expect(sendPushToUserCall).toHaveBeenCalledTimes(3);
    expect(addInAppNotificationForUserCall).toHaveBeenCalledTimes(3);
  });

  it('should return for createMicroChat', async () => {
    // Arrange
    const userId = 1;
    const hubId = 1;
    const microChatText = 'Hello';
    jest.spyOn(joinUserHubRepo, 'findOne').mockResolvedValueOnce({
      user: { id: userId },
      hub: { id: hubId },
    } as any);
    const expectResult = {
      hub: { id: hubId },
      text: microChatText,
    } as MicroChat;
    jest.spyOn(microChatRepo, 'create').mockImplementationOnce(value => value as any);
    const saveCall = jest
      .spyOn(microChatRepo, 'persistAndFlush')
      .mockImplementationOnce(() => Promise.resolve());
    // Act
    const result = await service.createMicroChat(userId, hubId, microChatText);
    // Assert
    expect(saveCall).toHaveBeenCalled();
    expect(result).toEqual(expectResult);
  });

  it('should resolve for deleteMicroChat', async () => {
    // Arrange
    const userId = 1;
    const hubId = 1;
    const microChatId = 1;
    jest.spyOn(joinUserHubRepo, 'findOne').mockResolvedValueOnce({
      user: { id: userId },
      hub: {
        id: hubId,
        load: jest.fn().mockResolvedValueOnce({
          microChats: {
            loadItems: jest.fn().mockResolvedValueOnce([
              {
                id: microChatId,
              },
              {
                id: 2,
              },
            ] as any)
          }
        })
      } as any,
    } as any);
    const deleteCall = jest
      .spyOn(microChatRepo, 'removeAndFlush')
      .mockImplementationOnce(() => Promise.resolve());
    // Act
    await service.deleteMicroChat(userId, hubId, microChatId);
    // Assert
    expect(deleteCall).toHaveBeenCalled();
  });
});
