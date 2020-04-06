import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from '../notification/notification.service';
import { HubService } from './hub.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { JoinUserHub } from 'src/dal/entity/joinUserHub.entity';
import { Hub } from 'src/dal/entity/hub.entity';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { JoinUserInAppNotifications } from 'src/dal/entity/joinUserInAppNotifications.entity';
import { MicroChat } from 'src/dal/entity/microChat.entity';
import { User } from 'src/dal/entity/user.entity';
import { InAppNotification } from 'src/dal/entity/inAppNotification.entity';
import { Repository } from 'typeorm';
import { QrService } from 'src/services/qr/qr.service';
import { FileService } from 'src/services/file/file.service';

describe('HubService', () => {
  let hubService: HubService;
  let joinUserHubRepo: Repository<JoinUserHub>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
      ],
      providers: [
        HubService,
        NotificationService,
        QrService,
        FileService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Hub),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(JoinUserHub),
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

    hubService = module.get<HubService>(HubService);
    joinUserHubRepo = module.get<Repository<JoinUserHub>>(getRepositoryToken(JoinUserHub));
  });

  it('should be defined', () => {
    expect(hubService).toBeDefined();
  });

  it('should return for getOneUserHub', async () => {
    //Arrange
    const userId = 1;
    const hubId = 2;
    const userHubTestResult = {
      userId,
      hubId,
      hub: {
        usersConnection: [{
          user: {}
        }],
        microChats: [
          {}
        ]
      }
    } as JoinUserHub;
    jest.spyOn(joinUserHubRepo, 'findOne').mockResolvedValueOnce(userHubTestResult);
    //Act
    const result = await hubService.getOneUserHub(userId, hubId);
    //Assert
    expect(userHubTestResult).toEqual(userHubTestResult);
  });
});
