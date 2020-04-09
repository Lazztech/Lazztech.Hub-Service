import { Test, TestingModule } from '@nestjs/testing';
import { HubActivityService } from './hub-activity.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JoinUserHub } from 'src/dal/entity/joinUserHub.entity';
import { Hub } from 'src/dal/entity/hub.entity';
import { InAppNotification } from 'src/dal/entity/inAppNotification.entity';
import { JoinUserInAppNotifications } from 'src/dal/entity/joinUserInAppNotifications.entity';
import { NotificationService } from 'src/notification/notification.service';
import { ConfigService, ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { User } from 'src/dal/entity/user.entity';

describe('HubActivityService', () => {
  let service: HubActivityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
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
          provide: getRepositoryToken(JoinUserInAppNotifications),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<HubActivityService>(HubActivityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return for activateHub', async () => {
    //TODO
  });

  it('should return for deactivateHub', async () => {
    //TODO
  });
});
