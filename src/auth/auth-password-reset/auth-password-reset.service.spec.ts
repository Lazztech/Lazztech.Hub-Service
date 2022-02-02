import { Test, TestingModule } from '@nestjs/testing';
import { AuthPasswordResetService } from './auth-password-reset.service';
import { EmailService } from '../../email/email.service';
import { PasswordReset } from '../../dal/entity/passwordReset.entity';
import { User } from '../../dal/entity/user.entity';
import { ConfigService } from '@nestjs/config';
import { ResetPassword } from '../dto/resetPassword.input';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

describe('AuthPasswordResetService', () => {
  let service: AuthPasswordResetService;
  let userRepo: EntityRepository<User>;
  let emailService: EmailService;
  let passwordResetRepo: EntityRepository<PasswordReset>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthPasswordResetService,
        EmailService,
        ConfigService,
        {
          provide: getRepositoryToken(User),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(PasswordReset),
          useClass: EntityRepository,
        },
      ],
    }).compile();

    service = module.get<AuthPasswordResetService>(AuthPasswordResetService);
    userRepo = module.get<EntityRepository<User>>(getRepositoryToken(User));
    emailService = module.get(EmailService);
    passwordResetRepo = module.get<EntityRepository<PasswordReset>>(
      getRepositoryToken(PasswordReset),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return for resetPassword', async () => {
    // Arrange
    const details = {
      usersEmail: 'gianlazzarini@gmail.com',
      resetPin: '123',
      newPassword: 'NewPassword',
    } as ResetPassword;
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce({
      email: details.usersEmail,
      passwordReset: {
        pin: details.resetPin,
      },
    } as any);
    const saveCall = jest
      .spyOn(userRepo, 'persistAndFlush')
      .mockImplementationOnce(() => Promise.resolve());
    // Act
    const result = await service.resetPassword(details);
    // Assert
    expect(result).toBeTruthy();
    expect(saveCall).toHaveBeenCalled();
  });

  it('should return for sendPasswordResetEmail', async () => {
    // Arrange
    const email = 'gianlazzarini@gmail.com';
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce({
      firstName: 'Gian',
      lastName: 'Lazzarini',
      email,
      passwordReset: {},
    } as any);
    jest.spyOn(passwordResetRepo, 'findOne').mockResolvedValueOnce(null);
    jest
      .spyOn(emailService, 'sendEmailFromPrimaryAddress')
      .mockResolvedValueOnce('id');
    const saveCall = jest
      .spyOn(userRepo, 'persistAndFlush')
      .mockImplementationOnce(() => Promise.resolve());
    // Act
    const result = await service.sendPasswordResetEmail(email);
    // Assert
    expect(result).toBeTruthy();
    expect(saveCall).toHaveBeenCalled();
  });
});
