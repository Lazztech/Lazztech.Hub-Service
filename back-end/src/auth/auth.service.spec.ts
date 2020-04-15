import { ConfigService, ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InAppNotification } from 'src/dal/entity/inAppNotification.entity';
import { JoinUserInAppNotifications } from 'src/dal/entity/joinUserInAppNotifications.entity';
import { User } from 'src/dal/entity/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { NotificationService } from 'src/notification/notification.service';
import { HttpModule } from '@nestjs/common';
import configuration from 'src/config/configuration';
import { UserDevice } from 'src/dal/entity/userDevice.entity';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: Repository<User>;
  let notificationService: NotificationService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
        HttpModule
      ],
      providers: [
        AuthService,
        NotificationService,
        ConfigService,
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
        {
          provide: getRepositoryToken(UserDevice),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    notificationService = module.get(NotificationService);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return for register', async () => {
    //Arrange
    const firstName = "Gian";
    const lastName = "Lazzarini";
    const email = "gianlazzarini@gmail.com";
    const password = "Password123";
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(undefined);
    jest.spyOn(userRepo, 'create').mockReturnValueOnce(undefined);
    const saveCall = jest.spyOn(userRepo, 'save').mockResolvedValueOnce({
      firstName,
      lastName,
      email,
    } as User);
    jest.spyOn(notificationService, 'addInAppNotificationForUser').mockImplementationOnce(
      () => Promise.resolve()
    );
    //Act
    const result = await service.register(firstName, lastName, email, password);
    //Assert
    expect(result).toBeDefined();
    expect(saveCall).toHaveBeenCalled();
  });

  it('should return accessToken for login', async () => {
    //Arrange
    const password = "Password123";
    const email = "gianlazzarini@gmail.com";
    const testUser = {
      id: 1,
      email,
      password: "$2a$12$kYPNrlyLr7z4D.V3dEHFn.kQD2nRC0x7fINzPgfoSW4D4GQhyeGTO",
    } as User;
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(testUser);

    //Act
    const result = await service.login(password, email);

    //Assert
    expect(result).toBeDefined();
  });

  it('should return for changePassword', async () => {
    //Arrange
    const password = "Password123";
    const email = "gianlazzarini@gmail.com";
    const testUser = {
      id: 1,
      email,
      password: "$2a$12$kYPNrlyLr7z4D.V3dEHFn.kQD2nRC0x7fINzPgfoSW4D4GQhyeGTO",
    } as User;
    const newPassword = "NewPassword123";
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(testUser);
    const saveCall = jest.spyOn(userRepo, 'save').mockResolvedValueOnce({} as User);
    //Act
    const result = await service.changePassword(testUser.id, {
      oldPassword: password,
      newPassword
    });
    //Assert
    expect(result).toBeTruthy();
    expect(saveCall).toHaveBeenCalled();
  });

  it('should return for deleteAccount', async () => {
    //Arrange
    const password = "Password123";
    const testUser = {
      id: 1,
      email: "gianlazzarini@gmail.com",
      password: "$2a$12$kYPNrlyLr7z4D.V3dEHFn.kQD2nRC0x7fINzPgfoSW4D4GQhyeGTO",
    } as User;
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(testUser);
    const removeCall = jest.spyOn(userRepo, 'remove').mockResolvedValueOnce({} as User);
    //Act
    const result = await service.deleteAccount(testUser.id, testUser.email, password);
    //Assert
    expect(result).toBeTruthy();
    expect(removeCall).toHaveBeenCalled();
  });
});
