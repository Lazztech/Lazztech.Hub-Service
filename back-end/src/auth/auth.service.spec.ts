import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InAppNotification } from 'src/dal/entity/inAppNotification.entity';
import { JoinUserInAppNotifications } from 'src/dal/entity/joinUserInAppNotifications.entity';
import { User } from 'src/dal/entity/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: Repository<User>;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
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
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it(`should return accessToken for login`, async () => {
    //Arrange
    const password = "Password123";
    const email = "gianlazzarini@gmail.com";
    const testUser = {
      id: 1,
      email,
      password: "$2a$12$kYPNrlyLr7z4D.V3dEHFn.kQD2nRC0x7fINzPgfoSW4D4GQhyeGTO",
    } as User;
    const accessTokenSecret = "***REMOVED***";
    const accessTokenResult = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTU4NTc5MjQxM30.EXe0IY-Q5dGFCyO5vgDIgeaTGqTqOO66MspE5pS-yd0";
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(testUser);
    jest.spyOn(configService, 'get').mockReturnValueOnce(accessTokenSecret);

    //Act
    const result = await service.login(password, email);

    //Assert
    expect(result).toEqual(accessTokenResult);
  });

  it('should return for register', async () => {
    //TODO
  });

  it('should return for changePassword', async () => {
    //TODO
  });

  it('should return for deleteAccount', async () => {
    //TODO
  });
});
