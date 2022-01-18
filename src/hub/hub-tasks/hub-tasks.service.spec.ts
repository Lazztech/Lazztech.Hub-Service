import { Test, TestingModule } from '@nestjs/testing';
import { JoinUserHub } from '../../dal/entity/joinUserHub.entity';
import { HubTasksService } from './hub-tasks.service';
import { HubGeofenceService } from '../hub-geofence/hub-geofence.service';
import { User } from '../../dal/entity/user.entity';
import { Hub } from '../../dal/entity/hub.entity';
import { NotificationService } from '../../notification/notification.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/common';
import { InAppNotification } from '../../dal/entity/inAppNotification.entity';
import { UserDevice } from '../../dal/entity/userDevice.entity';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

describe('HubTasksService', () => {
  let service: HubTasksService;
  let joinUserHubRepo: EntityRepository<JoinUserHub>;
  let hubGeofenceService: HubGeofenceService;

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
        HubTasksService,
        HubGeofenceService,
        NotificationService,
        {
          provide: getRepositoryToken(JoinUserHub),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: EntityRepository
        },
        {
          provide: getRepositoryToken(Hub),
          useClass: EntityRepository
        },
        {
          provide: getRepositoryToken(InAppNotification),
          useClass: EntityRepository
        },
        {
          provide: getRepositoryToken(UserDevice),
          useClass: EntityRepository
        }
      ],
    }).compile();

    service = module.get<HubTasksService>(HubTasksService);
    joinUserHubRepo = module.get<EntityRepository<JoinUserHub>>(
      getRepositoryToken(JoinUserHub),
    );
    hubGeofenceService = module.get<HubGeofenceService>(HubGeofenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should exit expired presence', async () => {
    // arrange
    const validPresence = {
      lastUpdated: Date.now().toString()
    } as JoinUserHub;
    const expiredPresence = {
      lastUpdated: '00000'
    } as JoinUserHub;
    const undefinedLastUpdated = {
      lastUpdated: undefined
    } as JoinUserHub;
    const findSpy = jest
      .spyOn(joinUserHubRepo, 'find')
      .mockResolvedValueOnce([
        validPresence,
        expiredPresence,
        undefinedLastUpdated
      ]);

    const exitHubGeofenceSpy = jest
      .spyOn(hubGeofenceService, 'exitedHubGeofence')
      .mockResolvedValue(null);

    // act
    await service.checkoutStalePresentUsers();

    // assert
    expect(findSpy).toHaveBeenCalled();
    expect(exitHubGeofenceSpy).toHaveBeenCalledTimes(2);
  });
});
