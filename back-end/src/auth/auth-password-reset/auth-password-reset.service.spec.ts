import { Test, TestingModule } from '@nestjs/testing';
import { AuthPasswordResetService } from './auth-password-reset.service';
import { EmailService } from 'src/services/email/email.service';
import { Repository } from 'typeorm';
import { PasswordReset } from 'src/dal/entity/passwordReset.entity';
import { User } from 'src/dal/entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

describe('AuthPasswordResetService', () => {
  let service: AuthPasswordResetService;
  let userRepo: Repository<User>;
  let emailService: EmailService;
  let passwordResetRepo: Repository<PasswordReset>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthPasswordResetService,
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
      ],
    }).compile();

    service = module.get<AuthPasswordResetService>(AuthPasswordResetService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    emailService = module.get(EmailService);
    passwordResetRepo = module.get<Repository<PasswordReset>>(getRepositoryToken(PasswordReset));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
