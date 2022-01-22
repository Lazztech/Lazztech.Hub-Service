import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { HttpModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Hub } from '../../dal/entity/hub.entity';
import { InAppNotification } from '../../dal/entity/inAppNotification.entity';
import { JoinUserHub } from '../../dal/entity/joinUserHub.entity';
import { User } from '../../dal/entity/user.entity';
import { UserDevice } from '../../dal/entity/userDevice.entity';
import { NotificationService } from '../../notification/notification.service';
import { HubGeofenceService } from './hub-geofence.service';

describe('HubGeofenceService', () => {
  let service: HubGeofenceService;
  let joinUserHubRepository: EntityRepository<JoinUserHub>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        HubGeofenceService,
        {
          provide: getRepositoryToken(JoinUserHub),
          useClass: EntityRepository,
        },
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
          provide: getRepositoryToken(UserDevice),
          useClass: EntityRepository,
        },
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
      ],
    }).compile();

    service = module.get<HubGeofenceService>(HubGeofenceService);
    joinUserHubRepository = module.get<EntityRepository<JoinUserHub>>(
      getRepositoryToken(JoinUserHub),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return for enteredHubGeofence', async () => {
    // Arrange
    const userId = 1;
    const hubId = 1;
    const hubRelationshipTest = {
      userId,
      hubId,
      hub: {
        load: jest.fn().mockResolvedValueOnce({
          active: true,
        } as Hub)
      } as any,
    } as JoinUserHub;
    jest
      .spyOn(joinUserHubRepository, 'findOne')
      .mockResolvedValueOnce(hubRelationshipTest);

    const notifyMembersSpy = jest
      .spyOn(service, 'notifyMembersOfArrival')
      .mockResolvedValue();

    const persistAndFlushCall = jest
      .spyOn(joinUserHubRepository, 'persistAndFlush')
      .mockImplementationOnce(() => Promise.resolve());

    // Act
    await service.enteredHubGeofence(userId, hubId);

    // Assert
    expect(persistAndFlushCall).toHaveBeenCalled();
    expect(notifyMembersSpy).toHaveBeenCalled();
  });

  it('should return for dwellHubGeofence', async () => {
    // Arrange
    const userId = 1;
    const hubId = 1;
    const hubRelationshipTest = {
      userId,
      hubId,
      hub: {
        load: jest.fn().mockResolvedValueOnce({
          active: true,
        } as Hub)
      } as any,
    } as JoinUserHub;
    jest
      .spyOn(joinUserHubRepository, 'findOne')
      .mockResolvedValueOnce(hubRelationshipTest);

    const notifyMembersSpy = jest
      .spyOn(service, 'notifyMembersOfArrival')
      .mockResolvedValue();

    const persistAndFlushCall = jest
      .spyOn(joinUserHubRepository, 'persistAndFlush')
      .mockImplementationOnce(() => Promise.resolve());
    // Act
    await service.dwellHubGeofence(userId, hubId);
    // Assert
    expect(persistAndFlushCall).toHaveBeenCalled();
    expect(notifyMembersSpy).not.toHaveBeenCalled();
  });

  it('should return for exitedHubGeofence', async () => {
    const userId = 1;
    const hubId = 1;
    const hubRelationshipTest = {
      userId,
      hubId,
      hub: {
        load: jest.fn().mockResolvedValueOnce({
          active: true,
        } as Hub)
      } as any,
    } as JoinUserHub;
    jest
      .spyOn(joinUserHubRepository, 'findOne')
      .mockResolvedValueOnce(hubRelationshipTest);

    const notifyMembersSpy = jest
      .spyOn(service, 'notifyMembersOfExit')
      .mockResolvedValue();

    const persistAndFlushCall = jest
      .spyOn(joinUserHubRepository, 'persistAndFlush')
      .mockImplementationOnce(() => Promise.resolve());
    // Act
    await service.exitedHubGeofence(userId, hubId);
    // Assert
    expect(persistAndFlushCall).toHaveBeenCalled();
    expect(notifyMembersSpy).toHaveBeenCalled();
  });
});
