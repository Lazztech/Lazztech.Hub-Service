import { Test, TestingModule } from '@nestjs/testing';
import { HubGeofenceService } from './hub-geofence.service';
import { Repository } from 'typeorm';
import { JoinUserHub } from '../../dal/entity/joinUserHub.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../dal/entity/user.entity';
import { Hub } from '../../dal/entity/hub.entity';
import { NotificationService } from '../../notification/notification.service';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/common';
import { InAppNotification } from '../../dal/entity/inAppNotification.entity';
import { UserDevice } from '../../dal/entity/userDevice.entity';

describe('HubGeofenceService', () => {
  let service: HubGeofenceService;
  let joinUserHubRepository: Repository<JoinUserHub>;
  let hubRepository: Repository<Hub>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        HubGeofenceService,
        {
          provide: getRepositoryToken(JoinUserHub),
          useClass: Repository,
        },
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
          provide: getRepositoryToken(UserDevice),
          useClass: Repository,
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
    joinUserHubRepository = module.get<Repository<JoinUserHub>>(
      getRepositoryToken(JoinUserHub),
    );
    hubRepository = module.get<Repository<Hub>>(getRepositoryToken(Hub));
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
      hub: Promise.resolve({
        active: true,
      } as Hub),
    } as JoinUserHub;
    jest
      .spyOn(joinUserHubRepository, 'findOne')
      .mockResolvedValueOnce(hubRelationshipTest);

    const notifyMembersSpy = jest
      .spyOn(service, 'notifyMembersOfArrival')
      .mockResolvedValue();

    const saveCall = jest
      .spyOn(joinUserHubRepository, 'save')
      .mockResolvedValueOnce({
        userId,
        hubId,
        isOwner: true,
      } as JoinUserHub);
    // Act
    await service.enteredHubGeofence(userId, hubId);
    // Assert
    expect(saveCall).toHaveBeenCalled();
    expect(notifyMembersSpy).toHaveBeenCalled();
  });

  it('should return for exitedHubGeofence', async () => {
    const userId = 1;
    const hubId = 1;
    const hubRelationshipTest = {
      userId,
      hubId,
    } as JoinUserHub;
    jest
      .spyOn(joinUserHubRepository, 'findOne')
      .mockResolvedValueOnce(hubRelationshipTest);

    const notifyMembersSpy = jest
      .spyOn(service, 'notifyMembersOfExit')
      .mockResolvedValue();

    const saveCall = jest
      .spyOn(joinUserHubRepository, 'save')
      .mockResolvedValueOnce({
        userId,
        hubId,
        isOwner: false,
        hub: Promise.resolve({
          active: true,
        } as Hub),
      } as JoinUserHub);
    // Act
    await service.exitedHubGeofence(userId, hubId);
    // Assert
    expect(saveCall).toHaveBeenCalled();
    expect(notifyMembersSpy).toHaveBeenCalled();
  });
});
