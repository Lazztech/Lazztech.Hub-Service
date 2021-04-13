import { ConfigService, ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InAppNotification } from '../dal/entity/inAppNotification.entity';
import { JoinUserInAppNotifications } from '../dal/entity/joinUserInAppNotifications.entity';
import { User } from '../dal/entity/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { NotificationService } from '../notification/notification.service';
import { HttpModule } from '@nestjs/common';
import { UserDevice } from '../dal/entity/userDevice.entity';
import { UserService } from '../user/user.service';
import { fileServiceToken } from '../services/services.module';
import { S3FileService } from '../services/file/s3-file/s3-file.service';
import { JoinUserHub } from '../dal/entity/joinUserHub.entity';
import { JwtModule } from '@nestjs/jwt';
import { S3Module, S3ModuleOptions } from 'nestjs-s3';
import { ImageFileService } from '../services/file/image-file/image-file.service';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: Repository<User>;
  let notificationService: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.local', '.env'],
          isGlobal: true,
        }),
        HttpModule,
        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('ACCESS_TOKEN_SECRET'),
            signOptions: { expiresIn: '60s' },
          }),
        }),
        S3Module.forRoot({
          config: {
            accessKeyId: 'minio',
            secretAccessKey: 'password',
            endpoint: 'http://127.0.0.1:9000',
            s3ForcePathStyle: true,
            signatureVersion: 'v4',
          },
        } as S3ModuleOptions),
      ],
      providers: [
        AuthService,
        NotificationService,
        ConfigService,
        UserService,
        ImageFileService,
        {
          provide: fileServiceToken,
          useClass: S3FileService,
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
        {
          provide: getRepositoryToken(UserDevice),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(JoinUserHub),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    notificationService = module.get(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return for register', async () => {
    // Arrange
    const firstName = 'Gian';
    const lastName = 'Lazzarini';
    const email = 'gianlazzarini@gmail.com';
    const password = 'Password123';
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(undefined);
    jest.spyOn(userRepo, 'create').mockReturnValueOnce(undefined);
    const saveCall = jest.spyOn(userRepo, 'save').mockResolvedValueOnce({
      firstName,
      lastName,
      email,
    } as User);
    jest
      .spyOn(notificationService, 'addInAppNotificationForUser')
      .mockImplementationOnce(() => Promise.resolve());
    // Act
    const result = await service.register(firstName, lastName, email, password);
    // Assert
    expect(result).toBeDefined();
    expect(saveCall).toHaveBeenCalled();
  });

  it('should return accessToken for login', async () => {
    // Arrange
    const password = 'Password123';
    const email = 'gianlazzarini@gmail.com';
    const testUser = {
      id: 1,
      email,
      password: '$2a$12$kYPNrlyLr7z4D.V3dEHFn.kQD2nRC0x7fINzPgfoSW4D4GQhyeGTO',
    } as User;
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(testUser);

    // Act
    const result = await service.login(password, email);

    // Assert
    expect(result).toBeDefined();
  });

  it('should return for changePassword', async () => {
    // Arrange
    const password = 'Password123';
    const email = 'gianlazzarini@gmail.com';
    const testUser = {
      id: 1,
      email,
      password: '$2a$12$kYPNrlyLr7z4D.V3dEHFn.kQD2nRC0x7fINzPgfoSW4D4GQhyeGTO',
    } as User;
    const newPassword = 'NewPassword123';
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(testUser);
    const saveCall = jest
      .spyOn(userRepo, 'save')
      .mockResolvedValueOnce({} as User);
    // Act
    const result = await service.changePassword(testUser.id, {
      oldPassword: password,
      newPassword,
    });
    // Assert
    expect(result).toBeTruthy();
    expect(saveCall).toHaveBeenCalled();
  });

  it('should return for deleteAccount', async () => {
    // Arrange
    const password = 'Password123';
    const testUser = {
      id: 1,
      email: 'gianlazzarini@gmail.com',
      password: '$2a$12$kYPNrlyLr7z4D.V3dEHFn.kQD2nRC0x7fINzPgfoSW4D4GQhyeGTO',
    } as User;
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(testUser);
    const removeCall = jest
      .spyOn(userRepo, 'remove')
      .mockResolvedValueOnce({} as User);
    // Act
    const result = await service.deleteAccount(
      testUser.id,
      testUser.email,
      password,
    );
    // Assert
    expect(result).toBeTruthy();
    expect(removeCall).toHaveBeenCalled();
  });
});
