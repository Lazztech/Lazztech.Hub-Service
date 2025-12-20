import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../dal/entity/user.entity';
import { PushNotificationDto } from './dto/pushNotification.dto';
import { InAppNotificationDto } from './dto/inAppNotification.dto';
import { InAppNotification } from '../dal/entity/inAppNotification.entity';
import { HttpService, HttpModule } from '@nestjs/axios';
import { of } from 'rxjs';
import { UserDevice } from '../dal/entity/userDevice.entity';
import { AxiosResponse } from 'axios';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';

describe('NotificationService', () => {
  let service: NotificationService;
  let userRepo: EntityRepository<User>;
  let inAppNotificationRepo: EntityRepository<InAppNotification>;
  let httpService: HttpService;
  let userDeviceRepo: EntityRepository<UserDevice>;
  let em: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'FIREBASE_SERVER_KEY':
                  return 'mockFirebaseServerKey';
                case 'PUSH_NOTIFICATION_ENDPOINT':
                  return 'http://localhost/mockUrl';
                default:
                  return '';
              }
            }),
          },
        },
        NotificationService,
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
          remove: jest.fn().mockReturnThis(),
          flush: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    userRepo = module.get<EntityRepository<User>>(getRepositoryToken(User));
    inAppNotificationRepo = module.get<EntityRepository<InAppNotification>>(
      getRepositoryToken(InAppNotification),
    );
    httpService = module.get(HttpService);
    userDeviceRepo = module.get<EntityRepository<UserDevice>>(
      getRepositoryToken(UserDevice),
    );
    em = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should resolve for addUserFcmNotificationToken', async () => {
    // Arrange
    const userId = 1;
    const token = 'asdfasdf';
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce({
      id: userId,
      userDevices: {
        loadItems: jest.fn().mockResolvedValueOnce([
          {
            user: { id: userId },
            fcmPushUserToken: 'otherToken',
          },
        ] as any)
      } as any,
    } as any);
    jest.spyOn(userDeviceRepo, 'create').mockImplementationOnce(value => value as any);
    const persistSpy = jest.spyOn(em, 'persist');
    const flushSpy = jest.spyOn(em, 'flush');
    // Act
    await service.addUserFcmNotificationToken(userId, token);
    // Assert
    expect(persistSpy).toHaveBeenCalled();
    expect(flushSpy).toHaveBeenCalled();
  });

  it('should return for getInAppNotifications', async () => {
    // TODO
    // Arrange
    const userId = 1;
    const expectedResult = [
      {
        user: { id: userId },
        text: 'test',
      },
      {
        user: { id: userId },
        text: 'test',
      },
    ] as InAppNotification[];
    jest
      .spyOn(inAppNotificationRepo, 'findAndCount')
      .mockResolvedValueOnce([expectedResult as any, expectedResult.length]);
    // Act
    const [items, total] = await service.getInAppNotifications(userId);
    // Assert
    expect(items).toEqual(expectedResult);
    expect(total).toEqual(expectedResult.length);
  });

  it('should save for addInAppNotificationForUser', async () => {
    // Arrange
    const userId = 1;
    const details = {
      text: 'text',
      date: Date.now().toString(),
    } as InAppNotificationDto;
    jest
      .spyOn(inAppNotificationRepo, 'create')
      .mockReturnValueOnce({ ...details, user: { id: userId }} as any);
    const persistSpy = jest.spyOn(em, 'persist');
    const flushSpy = jest.spyOn(em, 'flush');
    // Act
    await service.addInAppNotificationForUser(userId, details);
    // Assert
    expect(persistSpy).toHaveBeenCalled();
    expect(flushSpy).toHaveBeenCalled();
  });

  it('should resolve for deleteInAppNotification', async () => {
    // Arrange
    const userId = 1;
    const inAppNotificationId = 1;
    jest.spyOn(inAppNotificationRepo, 'findOne').mockResolvedValueOnce({
      user: { id: userId },
    } as any);
    const removeSpy = jest.spyOn(em, 'remove');
    const flushSpy = jest.spyOn(em, 'flush');
    // Act
    await service.deleteInAppNotification(userId, inAppNotificationId);
    // Assert
    expect(removeSpy).toHaveBeenCalled();
    expect(flushSpy).toHaveBeenCalled();
  });

  it('should resolve for deleteAllInAppNotifications', async () => {
    // Arrange
    const userId = 1;
    jest.spyOn(inAppNotificationRepo, 'find').mockResolvedValueOnce([
      {
        user: { id: userId },
      },
      {
        user: { id: userId },
      },
      {
        user: { id: userId },
      },
    ] as any[]);
    const removeSpy = jest.spyOn(em, 'remove');
    const flushSpy = jest.spyOn(em, 'flush');
    // Act
    await service.deleteAllInAppNotifications(userId);
    // Assert
    expect(removeSpy).toHaveBeenCalled();
    expect(flushSpy).toHaveBeenCalled();
  });

  it('sendPushToUser should sendPushNotification to each device fcmToken', async () => {
    // Arrange
    const userId = 1;
    const testNotification = {
      title: 'Test Title',
      body: 'Test Body',
      click_action: '',
    } as PushNotificationDto;
    const testUser = {
      id: userId,
      userDevices: {
        loadItems: jest.fn().mockResolvedValue([
          {
            id: 1,
            fcmPushUserToken: 'token1',
            webPushSubscription: {}
          },
          {
            id: 2,
            fcmPushUserToken: 'token2',
            webPushSubscription: {}
          },
          {
            id: 3,
            fcmPushUserToken: 'token3',
          },
        ] as any),
      } as any
    } as User;
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(testUser as any);
    const sendPushNotification = jest
      .spyOn(httpService, 'post')
      .mockImplementation(() => of({} as AxiosResponse<any>));
    const sendWebPushNotification = jest
      .spyOn(service, 'sendWebPushNotification')
      .mockImplementation(() => undefined);
    // Act
    await service.sendPushToUser(userId, testNotification);
    // Assert
    expect(sendWebPushNotification).toHaveBeenCalledTimes(2);
    expect(sendPushNotification).toHaveBeenCalledTimes(3);
  });
});
