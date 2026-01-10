import { ConfigService, ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { InAppNotification } from '../dal/entity/inAppNotification.entity';
import { User } from '../dal/entity/user.entity';
import { AuthService } from './auth.service';
import { NotificationService } from '../notification/notification.service';
import { HttpModule } from '@nestjs/axios';
import { UserDevice } from '../dal/entity/userDevice.entity';
import { UserService } from '../user/user.service';
import { S3FileService } from '../file/s3-file/s3-file.service';
import { JoinUserHub } from '../dal/entity/joinUserHub.entity';
import { JwtModule } from '@nestjs/jwt';
import { S3Module, S3ModuleOptions } from 'nestjs-s3';
import { ImageFileService } from '../file/image-file/image-file.service';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Block } from '../dal/entity/block.entity';
import { File } from '../dal/entity/file.entity';
import { JoinEventFile } from '../dal/entity/joinEventFile.entity';
import { JoinHubFile } from '../dal/entity/joinHubFile.entity';
import { FileService } from '../file/file-service.abstract';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: EntityRepository<User>;
  let notificationService: NotificationService;
  let em: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.local', '.env'],
          isGlobal: true,
        }),
        HttpModule,
        JwtModule.register({
          secret: 'dummyaccesstoken',
          signOptions: { expiresIn: '60s' },
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
          provide: FileService,
          useClass: S3FileService,
        },
        {
          provide: EntityManager,
          useValue: {
            persist: jest.fn().mockReturnThis(),
            remove: jest.fn().mockReturnThis(),
            flush: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: getRepositoryToken(User),
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
          provide: getRepositoryToken(JoinUserHub),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(Block),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(File),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(JoinEventFile),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(JoinHubFile),
          useClass: EntityRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get<EntityRepository<User>>(getRepositoryToken(User));
    notificationService = module.get(NotificationService);
    em = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return for register', async () => {
    // Arrange
    const firstName = 'Gian';
    const lastName = 'Lazzarini';
    const birthdate = '759398400';
    const email = 'gianlazzarini@gmail.com';
    const password = 'Password123';
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(undefined);
    jest.spyOn(userRepo, 'create').mockReturnValueOnce({
      firstName,
      lastName,
      birthdate,
      email,
      password,
      id: 1,
    } as any);

    const persistSpy = jest.spyOn(em, 'persist');
    const flushSpy = jest.spyOn(em, 'flush');

    jest
      .spyOn(notificationService, 'addInAppNotificationForUser')
      .mockImplementationOnce(() => Promise.resolve());
    // Act
    const result = await service.register(
      firstName,
      lastName,
      birthdate,
      email,
      password,
    );
    // Assert
    expect(result).toBeDefined();
    expect(persistSpy).toHaveBeenCalled();
    expect(flushSpy).toHaveBeenCalled();
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
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(testUser as any);

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
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(testUser as any);

    const persistSpy = jest.spyOn(em, 'persist');
    const flushSpy = jest.spyOn(em, 'flush');
    // Act
    const result = await service.changePassword(testUser.id, {
      oldPassword: password,
      newPassword,
    });
    // Assert
    expect(result).toBeTruthy();
    expect(persistSpy).toHaveBeenCalled();
    expect(flushSpy).toHaveBeenCalled();
  });

  it('should return for deleteAccount', async () => {
    // Arrange
    const password = 'Password123';
    const testUser = {
      id: 1,
      email: 'gianlazzarini@gmail.com',
      password: '$2a$12$kYPNrlyLr7z4D.V3dEHFn.kQD2nRC0x7fINzPgfoSW4D4GQhyeGTO',
    } as User;
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(testUser as any);
    const removeSpy = jest.spyOn(em, 'remove');
    const flushSpy = jest.spyOn(em, 'flush');
    // Act
    const result = await service.deleteAccount(
      testUser.id,
      testUser.email,
      password,
    );
    // Assert
    expect(result).toBeTruthy();
    expect(removeSpy).toHaveBeenCalled();
    expect(flushSpy).toHaveBeenCalled();
  });
});
