import { Test, TestingModule } from '@nestjs/testing';
import { HubActivityService } from './hub-activity.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JoinUserHub } from '../../dal/entity/joinUserHub.entity';
import { Hub } from '../../dal/entity/hub.entity';
import { InAppNotification } from '../../dal/entity/inAppNotification.entity';
import { NotificationService } from '../../notification/notification.service';
import { ConfigModule } from '@nestjs/config';
import { User } from '../../dal/entity/user.entity';
import { HttpModule } from '@nestjs/common';
import { UserDevice } from '../../dal/entity/userDevice.entity';

describe('HubActivityService', () => {
  let service: HubActivityService;
  let joinUserHubRepo: Repository<JoinUserHub>;
  let hubRepo: Repository<Hub>;
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
        HubActivityService,
        NotificationService,
        {
          provide: getRepositoryToken(JoinUserHub),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Hub),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(InAppNotification),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserDevice),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<HubActivityService>(HubActivityService);
    joinUserHubRepo = module.get<Repository<JoinUserHub>>(
      getRepositoryToken(JoinUserHub),
    );
    hubRepo = module.get<Repository<Hub>>(getRepositoryToken(Hub));
    notificationService = module.get(NotificationService);
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
      userId,
      hubId,
      isOwner: true,
      hub: Promise.resolve({
        active: false,
      }),
    } as JoinUserHub);
    const expectedResult = {
      active: true,
    } as Hub;
    jest.spyOn(hubRepo, 'save').mockResolvedValueOnce(expectedResult);
    jest.spyOn(joinUserHubRepo, 'find').mockResolvedValueOnce([
      {
        hubId,
        userId,
        hub: Promise.resolve({
          name: 'HubName',
          image: 'HubImage',
        }),
      },
      {
        hubId,
        userId: 2,
        hub: Promise.resolve({
          name: 'HubName',
          image: 'HubImage',
        }),
      },
    ] as JoinUserHub[]);
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
  });

  it('should return for deactivateHub', async () => {
    // Arrange
    const userId = 1;
    const hubId = 1;
    jest.spyOn(joinUserHubRepo, 'findOne').mockResolvedValueOnce({
      userId,
      hubId,
      isOwner: true,
      hub: Promise.resolve({
        active: true,
      }),
    } as JoinUserHub);
    const expectedResult = {
      active: false,
    } as Hub;
    jest.spyOn(hubRepo, 'save').mockResolvedValueOnce(expectedResult);
    // Act
    const result = await service.deactivateHub(userId, hubId);
    // Assert
    expect(result).toEqual(expectedResult);
  });
});