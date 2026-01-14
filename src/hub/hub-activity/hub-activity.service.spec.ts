import { Test, TestingModule } from '@nestjs/testing';
import { HubActivityService } from './hub-activity.service';
import { JoinUserHub } from '../../dal/entity/joinUserHub.entity';
import { Hub } from '../../dal/entity/hub.entity';
import { InAppNotification } from '../../dal/entity/inAppNotification.entity';
import { NotificationService } from '../../notification/notification.service';
import { ConfigModule } from '@nestjs/config';
import { User } from '../../dal/entity/user.entity';
import { HttpModule } from '@nestjs/axios';
import { UserDevice } from '../../dal/entity/userDevice.entity';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';

describe('HubActivityService', () => {
  let service: HubActivityService;
  let joinUserHubRepo: EntityRepository<JoinUserHub>;
  let notificationService: NotificationService;
  let em: EntityManager;

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
        HubActivityService,
        NotificationService,
        {
          provide: getRepositoryToken(JoinUserHub),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(Hub),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(InAppNotification),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(UserDevice),
          useClass: EntityRepository,
        },
        {
          provide: EntityManager,
          useValue: {
          persist: jest.fn().mockReturnThis(),
          flush: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<HubActivityService>(HubActivityService);
    joinUserHubRepo = module.get<EntityRepository<JoinUserHub>>(
      getRepositoryToken(JoinUserHub),
    );
    notificationService = module.get(NotificationService);
    em = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return for activateHub', async () => {
    // TODO finish me
    // Arrange
    const userId = 1;
    const hubId = 1;
    jest.spyOn(joinUserHubRepo, 'findOne').mockResolvedValueOnce({
      user: { id: userId } as any,
      isOwner: true,
      hub: {
        id: hubId,
        load: jest.fn().mockResolvedValueOnce({
          active: false,
        })
      } as any,
    } as any);
    const expectedResult = {
      active: true,
    } as Hub;

    const persistSpy = jest.spyOn(em, 'persist');
    const flushSpy = jest.spyOn(em, 'flush');

    jest.spyOn(joinUserHubRepo, 'find').mockResolvedValueOnce([
      {
        user: { id: userId } as any,
        hub: {
          id: hubId,
          load: jest.fn().mockResolvedValueOnce({
            name: 'HubName',
            coverImage: { load: jest.fn().mockResolvedValueOnce({ fileName: 'HubImage' }) },
          })
        } as any,
      },
      {
        user: { id: 2 },
        hub: {
          id: hubId,
          load: jest.fn().mockResolvedValueOnce({
            name: 'HubName',
            coverImage: { load: jest.fn().mockResolvedValueOnce({ fileName: 'HubImage' }) },
          })
        } as any,
      },
    ] as any[]);
    const sendPushCall = jest
      .spyOn(notificationService, 'sendPushToUser')
      .mockImplementation(() => Promise.resolve());
    const addInAppNotificationCall = jest
      .spyOn(notificationService, 'addInAppNotificationForUser')
      .mockImplementation(() => Promise.resolve());
    // Act
    const result = await service.activateHub(userId, hubId);
    // Assert
    expect(result).toEqual(expectedResult);
    expect(sendPushCall).toHaveBeenCalledTimes(2);
    expect(addInAppNotificationCall).toHaveBeenCalledTimes(2);
    expect(persistSpy).toHaveBeenCalled();
    expect(flushSpy).toHaveBeenCalled();
  });

  it('should return for deactivateHub', async () => {
    // Arrange
    const userId = 1;
    const hubId = 1;
    jest.spyOn(joinUserHubRepo, 'findOne').mockResolvedValueOnce({
      user: { id: userId } as any,
      isOwner: true,
      hub: {
        id: hubId,
        load: jest.fn().mockResolvedValueOnce({
          active: true,
        })
      } as any,
    } as any);
    const expectedResult = {
      active: false,
    } as Hub;
    const persistSpy = jest.spyOn(em, 'persist');
    const flushSpy = jest.spyOn(em, 'flush');
    // Act
    const result = await service.deactivateHub(userId, hubId);
    // Assert
    expect(result).toEqual(expectedResult);
    expect(persistSpy).toHaveBeenCalled();
    expect(flushSpy).toHaveBeenCalled();
  });
});
