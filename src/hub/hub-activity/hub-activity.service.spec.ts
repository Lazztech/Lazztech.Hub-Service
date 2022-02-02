import { Test, TestingModule } from '@nestjs/testing';
import { HubActivityService } from './hub-activity.service';
import { JoinUserHub } from '../../dal/entity/joinUserHub.entity';
import { Hub } from '../../dal/entity/hub.entity';
import { InAppNotification } from '../../dal/entity/inAppNotification.entity';
import { NotificationService } from '../../notification/notification.service';
import { ConfigModule } from '@nestjs/config';
import { User } from '../../dal/entity/user.entity';
import { HttpModule } from '@nestjs/common';
import { UserDevice } from '../../dal/entity/userDevice.entity';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

describe('HubActivityService', () => {
  let service: HubActivityService;
  let joinUserHubRepo: EntityRepository<JoinUserHub>;
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
      ],
    }).compile();

    service = module.get<HubActivityService>(HubActivityService);
    joinUserHubRepo = module.get<EntityRepository<JoinUserHub>>(
      getRepositoryToken(JoinUserHub),
    );
    hubRepo = module.get<EntityRepository<Hub>>(getRepositoryToken(Hub));
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
    jest.spyOn(hubRepo, 'persistAndFlush').mockImplementationOnce(() => Promise.resolve());
    jest.spyOn(joinUserHubRepo, 'find').mockResolvedValueOnce([
      {
        user: { id: userId } as any,
        hub: {
          id: hubId,
          load: jest.fn().mockResolvedValueOnce({
            name: 'HubName',
            image: 'HubImage',
          })
        } as any,
      },
      {
        user: { id: 2 },
        hub: {
          id: hubId,
          load: jest.fn().mockResolvedValueOnce({
            name: 'HubName',
            image: 'HubImage',
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
    jest.spyOn(hubRepo, 'persistAndFlush').mockImplementationOnce(() => Promise.resolve());
    // Act
    const result = await service.deactivateHub(userId, hubId);
    // Assert
    expect(result).toEqual(expectedResult);
  });
});
