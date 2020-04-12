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
  let emailService: EmailService;
  let passwordResetRepo: Repository<PasswordReset>;

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
    emailService = module.get(EmailService);
    passwordResetRepo = module.get<Repository<PasswordReset>>(getRepositoryToken(PasswordReset));
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

  it('should return for resetPassword', async () => {
    //TODO
  });

  it('should return for sendPasswordResetEmail', async () => {
    //Arrange
    const email = "gianlazzarini@gmail.com";
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce({
      firstName: "Gian",
      lastName: "Lazzarini",
      email,
      passwordReset: {},
    } as User);
    jest.spyOn(passwordResetRepo, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(emailService, 'sendEmailFromPrimaryAddress').mockResolvedValueOnce('id');
    const saveCall = jest.spyOn(userRepo, 'save').mockResolvedValueOnce({} as User);
    //Act
    const result = await service.sendPasswordResetEmail(email);
    //Assert
    expect(result).toBeTruthy();
    expect(saveCall).toHaveBeenCalled();
  });
});
