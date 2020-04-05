import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { User } from 'src/dal/entity/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/services/email/email.service';
import { PasswordReset } from 'src/dal/entity/passwordReset.entity';
import { InAppNotification } from 'src/dal/entity/inAppNotification.entity';
import { JoinUserInAppNotifications } from 'src/dal/entity/joinUserInAppNotifications.entity';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let userRepo: Repository<User>;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        EmailService,
        ConfigService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(PasswordReset),
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

    service = module.get<AuthenticationService>(AuthenticationService);
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
});
