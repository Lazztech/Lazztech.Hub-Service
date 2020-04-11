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
  let joinUserHubRepo: Repository<JoinUserHub>;
  let hubRepo: Repository<Hub>;

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
    joinUserHubRepo = module.get<Repository<JoinUserHub>>(getRepositoryToken(JoinUserHub));
    hubRepo = module.get<Repository<Hub>>(getRepositoryToken(Hub));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return for activateHub', async () => {
    // //Arrange
    // const userId = 1;
    // const hubId = 1;
    // jest.spyOn(joinUserHubRepo, 'findOne').mockResolvedValueOnce({
    //   userId,
    //   hubId,
    //   isOwner: true,
    //   hub: {
    //     active: false
    //   }
    // } as JoinUserHub);
    // const expectedResult = {
    //   active: true
    // } as Hub;
    // jest.spyOn(hubRepo, 'save').mockResolvedValueOnce(expectedResult);
    //Act
    // const result = await service.activateHub(userId, hubId);
    //Assert
    // expect(result).toEqual(expectedResult);
  });

  it('should return for deactivateHub', async () => {
    //Arrange
    const userId = 1;
    const hubId = 1;
    jest.spyOn(joinUserHubRepo, 'findOne').mockResolvedValueOnce({
      userId,
      hubId,
      isOwner: true,
      hub: {
        active: true
      }
    } as JoinUserHub);
    const expectedResult = {
      active: false
    } as Hub;
    jest.spyOn(hubRepo, 'save').mockResolvedValueOnce(expectedResult);
    //Act
    const result = await service.deactivateHub(userId, hubId);
    //Assert
    expect(result).toEqual(expectedResult);
  });
});
