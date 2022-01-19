import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../dal/entity/user.entity';
import { PushNotificationDto } from './dto/pushNotification.dto';
import { InAppNotificationDto } from './dto/inAppNotification.dto';
import { InAppNotification } from '../dal/entity/inAppNotification.entity';
import { HttpService, HttpModule } from '@nestjs/common';
import { of } from 'rxjs';
import { UserDevice } from '../dal/entity/userDevice.entity';
import { AxiosResponse } from 'axios';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

describe('NotificationService', () => {
  let service: NotificationService;
  let userRepo: EntityRepository<User>;
  let inAppNotificationRepo: EntityRepository<InAppNotification>;
  let httpService: HttpService;
  let userDeviceRepo: EntityRepository<UserDevice>;

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
      userDevices: [
        {
          fcmPushUserToken: 'otherToken',
        },
      ] as any,
    } as User);
    const saveCall = jest
      .spyOn(userDeviceRepo, 'persistAndFlush')
      .mockImplementationOnce(() => Promise.resolve());
    // Act
    await service.addUserFcmNotificationToken(userId, token);
    // Assert
    expect(saveCall).toHaveBeenCalled();
  });

  it('should return for getInAppNotifications', async () => {
    // TODO
    // Arrange
    const userId = 1;
    const expectedResult = [
      {
        userId,
        text: 'test',
      },
      {
        userId,
        text: 'test',
      },
    ] as InAppNotification[];
    jest
      .spyOn(inAppNotificationRepo, 'findAndCount')
      .mockResolvedValueOnce([expectedResult, expectedResult.length]);
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
      .mockReturnValueOnce({ ...details, userId } as InAppNotification);
    const saveCall1 = jest
      .spyOn(inAppNotificationRepo, 'persistAndFlush')
      .mockImplementationOnce(() => Promise.resolve());
    // Act
    await service.addInAppNotificationForUser(userId, details);
    // Assert
    expect(saveCall1).toHaveBeenCalled();
  });

  it('should resolve for deleteInAppNotification', async () => {
    // Arrange
    const userId = 1;
    const inAppNotificationId = 1;
    jest.spyOn(inAppNotificationRepo, 'findOne').mockResolvedValueOnce({
      userId,
    } as InAppNotification);
    const removeCall = jest
      .spyOn(inAppNotificationRepo, 'remove')
      .mockResolvedValueOnce({} as InAppNotification);
    // Act
    await service.deleteInAppNotification(userId, inAppNotificationId);
    // Assert
    expect(removeCall).toHaveBeenCalled();
  });

  it('should resolve for deleteAllInAppNotifications', async () => {
    // Arrange
    const userId = 1;
    jest.spyOn(inAppNotificationRepo, 'find').mockResolvedValueOnce([
      {
        userId,
      },
      {
        userId,
      },
      {
        userId,
      },
    ] as InAppNotification[]);
    const removeCall = jest
      .spyOn(inAppNotificationRepo, 'remove')
      .mockResolvedValueOnce({} as InAppNotification);
    // Act
    await service.deleteAllInAppNotifications(userId);
    // Assert
    expect(removeCall).toHaveBeenCalled();
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
      userDevices: [
        {
          id: 1,
          fcmPushUserToken: 'token1',
        },
        {
          id: 2,
          fcmPushUserToken: 'token2',
        },
        {
          id: 3,
          fcmPushUserToken: 'token3',
        },
      ] as any,
    } as User;
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(testUser);
    const sendPushNotification = jest
      .spyOn(httpService, 'post')
      .mockImplementation(() => of({} as AxiosResponse<any>));
    // Act
    await service.sendPushToUser(userId, testNotification);
    // Assert
    expect(sendPushNotification).toHaveBeenCalledTimes(3);
  });
});
