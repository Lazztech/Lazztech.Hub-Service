import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/dal/entity/user.entity';
import { Repository } from 'typeorm';
import { Notification } from './dto/notification.dto';

describe('NotificationService', () => {
  let service: NotificationService;
  let userRepo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService, 
        ConfigService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('sendPushToUser should sendPushNotification to each device fcmToken', async () => {
    //Arrange
    const userId = 1;
    const testNotification = {
      title: 'Test Title',
      body: 'Test Body',
      click_action: ''
    } as Notification;
    const testUser = {
      id: userId,
      userDevices: [
        {
          id: 1,
          fcmPushUserToken: "token1"
        },
        {
          id: 2,
          fcmPushUserToken: "token2"
        },
        {
          id: 3,
          fcmPushUserToken: "token3"
        },
      ]
    } as User;
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(testUser);
    const sendPushNotification = jest.spyOn(service, 'sendPushNotification').mockImplementation(
      () => Promise.resolve()
    );
    //Act
    await service.sendPushToUser(userId, testNotification);
    //Assert
    expect(sendPushNotification).toHaveBeenCalledTimes(3);
  })
});
