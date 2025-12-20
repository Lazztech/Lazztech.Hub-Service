import { Test, TestingModule } from '@nestjs/testing';
import { AuthPasswordResetService } from './auth-password-reset.service';
import { EmailService } from '../../email/email.service';
import { PasswordReset } from '../../dal/entity/passwordReset.entity';
import { User } from '../../dal/entity/user.entity';
import { ConfigService } from '@nestjs/config';
import { ResetPassword } from '../dto/resetPassword.input';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';

describe('AuthPasswordResetService', () => {
  let service: AuthPasswordResetService;
  let userRepo: EntityRepository<User>;
  let emailService: EmailService;
  let passwordResetRepo: EntityRepository<PasswordReset>;
  let em: EntityManager;

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
        {
          provide: EntityManager,
          useValue: {
          persist: jest.fn().mockReturnThis(),
          flush: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<AuthPasswordResetService>(AuthPasswordResetService);
    userRepo = module.get<EntityRepository<User>>(getRepositoryToken(User));
    emailService = module.get(EmailService);
    passwordResetRepo = module.get<EntityRepository<PasswordReset>>(
      getRepositoryToken(PasswordReset),
    );
    em = module.get<EntityManager>(EntityManager);
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
        load: jest.fn().mockResolvedValueOnce({
          pin: details.resetPin,
        })
      },
    } as any);
    const persistSpy = jest.spyOn(em, 'persist');
    const flushSpy = jest.spyOn(em, 'flush');
    // Act
    const result = await service.resetPassword(details);
    // Assert
    expect(result).toBeTruthy();
    expect(persistSpy).toHaveBeenCalled();
    expect(flushSpy).toHaveBeenCalled();
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
    jest.spyOn(passwordResetRepo, 'create')
      .mockImplementationOnce(value => value as any);
    const persistSpy = jest.spyOn(em, 'persist');
    const flushSpy = jest.spyOn(em, 'flush');
    // Act
    const result = await service.sendPasswordResetEmail(email);
    // Assert
    expect(result).toBeTruthy();
    expect(persistSpy).toHaveBeenCalled();
    expect(flushSpy).toHaveBeenCalled();
  });
});
