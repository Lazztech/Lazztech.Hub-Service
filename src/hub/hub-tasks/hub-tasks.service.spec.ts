import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JoinUserHub } from '../../dal/entity/joinUserHub.entity';
import { Repository } from 'typeorm';
import { HubTasksService } from './hub-tasks.service';
import { HubGeofenceService } from '../hub-geofence/hub-geofence.service';
import { User } from '../../dal/entity/user.entity';
import { Hub } from '../../dal/entity/hub.entity';
import { NotificationService } from '../../notification/notification.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/common';
import { InAppNotification } from '../../dal/entity/inAppNotification.entity';
import { UserDevice } from '../../dal/entity/userDevice.entity';

describe('HubTasksService', () => {
  let service: HubTasksService;

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
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(Hub),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(InAppNotification),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(UserDevice),
          useClass: Repository
        }
      ],
    }).compile();

    service = module.get<HubTasksService>(HubTasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
