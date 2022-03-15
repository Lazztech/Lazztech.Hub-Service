import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { HttpModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Block } from '../../dal/entity/block.entity';
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
  let userRepository: EntityRepository<User>;
  let hubRepository: EntityRepository<Hub>;
  let blockRepository: EntityRepository<Block>;
  let notificationService: NotificationService;

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
          provide: getRepositoryToken(Block),
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
    userRepository = module.get<EntityRepository<User>>(
      getRepositoryToken(User)
    );
    hubRepository = module.get<EntityRepository<Hub>>(
      getRepositoryToken(Hub)
    );
    blockRepository = module.get<EntityRepository<Block>>(
      getRepositoryToken(Block),
    );
    notificationService = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //enteredHubGeofence

  it('should throw for enteredHubGeofence when hubRelationship doesnt exist', async () => {
    // Arrange
    const userId = 1;
    const hubId = 1;
    const hubRelationshipTest = undefined;
    jest
      .spyOn(joinUserHubRepository, 'findOne')
      .mockResolvedValueOnce(hubRelationshipTest as any);

    const notifyMembersSpy = jest
      .spyOn(service, 'notifyMembersOfArrival')
      .mockResolvedValue();

    const persistAndFlushCall = jest
      .spyOn(joinUserHubRepository, 'persistAndFlush')
      .mockImplementationOnce(() => Promise.resolve());

    // Act & Assert
    await expect(service.enteredHubGeofence(userId, hubId)).rejects.toThrow();
    expect(persistAndFlushCall).not.toHaveBeenCalled();
    expect(notifyMembersSpy).not.toHaveBeenCalled();
  });

  it('should return for enteredHubGeofence user was not present & hub is active', async () => {
    // Arrange
    const userId = 1;
    const hubId = 1;
    const hubRelationshipTest = {
      isPresent: false,
      user: { id: userId },
      hub: {
        id: hubId,
        load: jest.fn().mockResolvedValueOnce({
          active: true,
        } as Hub) as any
      },
    } as JoinUserHub;
    jest
      .spyOn(joinUserHubRepository, 'findOne')
      .mockResolvedValueOnce(hubRelationshipTest as any);

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

  it('should return for enteredHubGeofence user was not present & hub is not active', async () => {
    // Arrange
    const userId = 1;
    const hubId = 1;
    const hubRelationshipTest = {
      isPresent: false,
      user: { id: userId },
      hub: {
        id: hubId,
        load: jest.fn().mockResolvedValueOnce({
          active: false,
        } as Hub) as any
      },
    } as JoinUserHub;
    jest
      .spyOn(joinUserHubRepository, 'findOne')
      .mockResolvedValueOnce(hubRelationshipTest as any);

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
    expect(notifyMembersSpy).not.toHaveBeenCalled();
  });

  it('should return for enteredHubGeofence user was present', async () => {
    // Arrange
    const userId = 1;
    const hubId = 1;
    const hubRelationshipTest = {
      isPresent: true,
      user: { id: userId },
      hub: {
        id: hubId,
        load: jest.fn().mockResolvedValueOnce({
          active: true,
        } as Hub) as any
      },
    } as JoinUserHub;
    jest
      .spyOn(joinUserHubRepository, 'findOne')
      .mockResolvedValueOnce(hubRelationshipTest as any);

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
    expect(notifyMembersSpy).not.toHaveBeenCalled();
  });

  // dwellHubGeofence

  it('should return for dwellHubGeofence when hubRelationship doesnt exist', async () => {
    // Arrange
    const userId = 1;
    const hubId = 1;
    const hubRelationshipTest = undefined;
    jest
      .spyOn(joinUserHubRepository, 'findOne')
      .mockResolvedValueOnce(hubRelationshipTest as any);

    const notifyMembersSpy = jest
      .spyOn(service, 'notifyMembersOfArrival')
      .mockResolvedValue();

    const persistAndFlushCall = jest
      .spyOn(joinUserHubRepository, 'persistAndFlush')
      .mockImplementationOnce(() => Promise.resolve());

    // Act & Assert
    await expect(service.dwellHubGeofence(userId, hubId)).rejects.toThrow();
    expect(persistAndFlushCall).not.toHaveBeenCalled();
    expect(notifyMembersSpy).not.toHaveBeenCalled();
  });

  it('should return for dwellHubGeofence user was not present', async () => {
    // Arrange
    const userId = 1;
    const hubId = 1;
    const hubRelationshipTest = {
      isPresent: false,
      user: { id: userId },
      hub: {
        id: hubId,
        load: jest.fn().mockResolvedValueOnce({
          active: true,
        } as Hub) as any
      },
    } as JoinUserHub;
    jest
      .spyOn(joinUserHubRepository, 'findOne')
      .mockResolvedValueOnce(hubRelationshipTest as any);

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

  it('should return for dwellHubGeofence user was present', async () => {
    // Arrange
    const userId = 1;
    const hubId = 1;
    const hubRelationshipTest = {
      isPresent: true,
      user: { id: userId },
      hub: {
        id: hubId,
        load: jest.fn().mockResolvedValueOnce({
          active: true,
        } as Hub) as any
      },
    } as JoinUserHub;
    jest
      .spyOn(joinUserHubRepository, 'findOne')
      .mockResolvedValueOnce(hubRelationshipTest as any);

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

  // exitedHubGeofence

  it('should return for exitedHubGeofence user was not present', async () => {
    const userId = 1;
    const hubId = 1;
    const hubRelationshipTest = undefined;
    jest
      .spyOn(joinUserHubRepository, 'findOne')
      .mockResolvedValueOnce(hubRelationshipTest as any);

    const notifyMembersSpy = jest
      .spyOn(service, 'notifyMembersOfExit')
      .mockResolvedValue();

    const persistAndFlushCall = jest
      .spyOn(joinUserHubRepository, 'persistAndFlush')
      .mockImplementationOnce(() => Promise.resolve());

    // Act & Assert
    await expect(service.exitedHubGeofence(userId, hubId)).rejects.toThrow();
    expect(persistAndFlushCall).not.toHaveBeenCalled();
    expect(notifyMembersSpy).not.toHaveBeenCalled();
  });

  it('should return for exitedHubGeofence user was not present & hub is active', async () => {
    const userId = 1;
    const hubId = 1;
    const hubRelationshipTest = {
      isPresent: true,
      user: { id: userId },
      hub: {
        id: hubId,
        load: jest.fn().mockResolvedValueOnce({
          active: true,
        } as Hub) as any
      },
    } as JoinUserHub;
    jest
      .spyOn(joinUserHubRepository, 'findOne')
      .mockResolvedValueOnce(hubRelationshipTest as any);

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

  it('should return for exitedHubGeofence user was not present & hub is not active', async () => {
    const userId = 1;
    const hubId = 1;
    const hubRelationshipTest = {
      isPresent: true,
      user: { id: userId },
      hub: {
        id: hubId,
        load: jest.fn().mockResolvedValueOnce({
          active: false,
        } as Hub) as any
      },
    } as JoinUserHub;
    jest
      .spyOn(joinUserHubRepository, 'findOne')
      .mockResolvedValueOnce(hubRelationshipTest as any);

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
    expect(notifyMembersSpy).not.toHaveBeenCalled();
  });

  it('should return for exitedHubGeofence user was present', async () => {
    const userId = 1;
    const hubId = 1;
    const hubRelationshipTest = {
      isPresent: false,
      user: { id: userId },
      hub: {
        id: hubId,
        load: jest.fn().mockResolvedValueOnce({
          active: true,
        } as Hub) as any
      },
    } as JoinUserHub;
    jest
      .spyOn(joinUserHubRepository, 'findOne')
      .mockResolvedValueOnce(hubRelationshipTest as any);

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
    expect(notifyMembersSpy).not.toHaveBeenCalled();
  });

  // notifyMembersOfArrival

  it('should only notify users you haven not blocked', async () => {
    // Arrange
    const mockHub = {
      id: 1,
      name: 'testHub',
      image: 'testImage'
    } as Hub;
    const mockUser = {
      id: 1,
      firstName: 'testUser'
    } as User;

    const unblockedUserId = 2;
    const blockedUserId = 3;
    const mockHubRelationships = [
      {
        user: { id: mockUser.id },
        hub: { id: mockHub.id },
      },
      {
        user: { id: unblockedUserId },
        hub: { id: mockHub.id },
      },
      {
        user: { id: blockedUserId },
        hub: { id: mockHub.id },
      }
    ] as Array<JoinUserHub>;
    jest
      .spyOn(joinUserHubRepository, 'find')
      .mockResolvedValueOnce(mockHubRelationships as any);

    const mockBlocks = [
      {
        from: { id: mockUser.id },
        to: { id: blockedUserId }
      }
    ] as Array<Block>;
    jest
      .spyOn(blockRepository, 'find')
      .mockResolvedValueOnce(mockBlocks as any);

    jest
      .spyOn(userRepository, 'findOne')
      .mockResolvedValueOnce(mockUser as any);
    jest
      .spyOn(hubRepository, 'findOne')
      .mockResolvedValueOnce(mockHub as any);

    const addInAppNotificationForUserSpy = jest
      .spyOn(notificationService, 'addInAppNotificationForUser')
      .mockResolvedValue();
    const sendPushToUserSpy = jest
      .spyOn(notificationService, 'sendPushToUser')
      .mockResolvedValue();

    // Act
    await service.notifyMembersOfArrival(mockUser.id, mockHub.id);

    // Assert
    expect(addInAppNotificationForUserSpy).toHaveBeenCalledTimes(2);
    expect(sendPushToUserSpy).toHaveBeenCalledTimes(2);
  });

  // notifyMembersOfExit
});
