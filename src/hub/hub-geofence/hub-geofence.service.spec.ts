import { Test, TestingModule } from '@nestjs/testing';
import { HubGeofenceService } from './hub-geofence.service';
import { GeofenceEvent, JoinUserHub } from '../../dal/entity/joinUserHub.entity';
import { User } from '../../dal/entity/user.entity';
import { Hub } from '../../dal/entity/hub.entity';
import { NotificationService } from '../../notification/notification.service';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/common';
import { InAppNotification } from '../../dal/entity/inAppNotification.entity';
import { UserDevice } from '../../dal/entity/userDevice.entity';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

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
        active: true,
      } as any,
    } as JoinUserHub;
    jest
      .spyOn(joinUserHubRepository, 'findOne')
      .mockResolvedValueOnce(hubRelationshipTest);

    const notifyMembersSpy = jest
      .spyOn(service, 'notifyMembersOfArrival')
      .mockResolvedValue();

    const updateCall = jest
      .spyOn(joinUserHubRepository, 'update')
      .mockResolvedValueOnce(null);
    // Act
    await service.enteredHubGeofence(userId, hubId);
    // Assert
    expect(updateCall).toHaveBeenCalledWith({
      userId,
      hubId,
    }, {
      isPresent: true,
      lastUpdated: expect.any(String),
      lastGeofenceEvent: GeofenceEvent.ENTERED
    } as JoinUserHub);
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
        active: true,
      } as any,
    } as JoinUserHub;
    jest
      .spyOn(joinUserHubRepository, 'findOne')
      .mockResolvedValueOnce(hubRelationshipTest);

    const notifyMembersSpy = jest
      .spyOn(service, 'notifyMembersOfArrival')
      .mockResolvedValue();

    const updateCall = jest
      .spyOn(joinUserHubRepository, 'update')
      .mockResolvedValueOnce(null);
    // Act
    await service.dwellHubGeofence(userId, hubId);
    // Assert
    expect(updateCall).toHaveBeenCalledWith({
      userId,
      hubId
    }, {
      isPresent: true,
      lastUpdated: expect.any(String),
      lastGeofenceEvent: GeofenceEvent.DWELL
    } as JoinUserHub);
    expect(notifyMembersSpy).not.toHaveBeenCalled();
  });

  it('should return for exitedHubGeofence', async () => {
    const userId = 1;
    const hubId = 1;
    const hubRelationshipTest = {
      userId,
      hubId,
      hub: {
        active: true,
      } as any,
    } as JoinUserHub;
    jest
      .spyOn(joinUserHubRepository, 'findOne')
      .mockResolvedValueOnce(hubRelationshipTest);

    const notifyMembersSpy = jest
      .spyOn(service, 'notifyMembersOfExit')
      .mockResolvedValue();

    const updateCall = jest
      .spyOn(joinUserHubRepository, 'update')
      .mockResolvedValueOnce(null);
    // Act
    await service.exitedHubGeofence(userId, hubId);
    // Assert
    expect(updateCall).toHaveBeenCalledWith({
      userId,
      hubId,
    }, {
      isPresent: false,
      lastUpdated: expect.any(String),
      lastGeofenceEvent: GeofenceEvent.EXITED
    } as JoinUserHub);
    expect(notifyMembersSpy).toHaveBeenCalled();
  });
});
