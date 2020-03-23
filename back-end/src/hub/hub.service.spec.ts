import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from '../notification/notification.service';
import { HubService } from './hub.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { JoinUserHub } from 'src/dal/entity/joinUserHub';

describe('HubService', () => {
  let hubService: HubService;
  let notificationService: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [    
        ConfigModule.forRoot({
        load: [configuration],
        isGlobal: true,
      }),
      ],
      providers: [HubService, NotificationService],
    }).compile();

    hubService = module.get<HubService>(HubService);
    notificationService = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(hubService).toBeDefined();
  });

  it(`should not notify those passed in as exceptions`, async () => {
    //TODO finish this & refactor hub.service
    let userHubRelationships: JoinUserHub[] = [
      {} as JoinUserHub
    ];
    let except: JoinUserHub[] = [
      {} as JoinUserHub
    ];
    let spy = jest.spyOn(notificationService, "sendPushToUser")
    await hubService.notifyOfHubActivated(userHubRelationships, except);

  });

});
