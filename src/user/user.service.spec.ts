import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Block } from '../dal/entity/block.entity';
import { File } from '../dal/entity/file.entity';
import { Hub } from '../dal/entity/hub.entity';
import { Invite } from '../dal/entity/invite.entity';
import { JoinUserHub } from '../dal/entity/joinUserHub.entity';
import { PasswordReset } from '../dal/entity/passwordReset.entity';
import { User } from '../dal/entity/user.entity';
import { EmailService } from '../email/email.service';
import { FILE_SERVICE } from '../file/file-service.token';
import { ImageFileService } from '../file/image-file/image-file.service';
import { LocalFileService } from '../file/local-file/local-file.service';
import { EditUserDetails } from './dto/editUserDetails.input';
import { UserService } from './user.service';
import { JoinEventFile } from '../dal/entity/joinEventFile.entity';
import { JoinHubFile } from '../dal/entity/joinHubFile.entity';

describe('UserService', () => {
  let service: UserService;
  let joinUserHubRepo: EntityRepository<JoinUserHub>;
  let userRepo: EntityRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        ImageFileService,
        {
          provide: FILE_SERVICE,
          useClass: LocalFileService,
        },
        EmailService,
        ConfigService,
        {
          provide: getRepositoryToken(PasswordReset),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(JoinUserHub),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(Invite),
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

    service = module.get<UserService>(UserService);
    // Save the instance of the repository and set the correct generics
    joinUserHubRepo = module.get<EntityRepository<JoinUserHub>>(
      getRepositoryToken(JoinUserHub),
    );
    userRepo = module.get<EntityRepository<User>>(getRepositoryToken(User));
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should return for getUser', async () => {
    // Arrange
    const userId = 1;
    const testUser = {
      id: userId,
      firstName: 'Test',
      lastName: 'Test',
    } as User;
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(testUser as any);
    // Act
    const result = await service.getUser(userId);
    // Assert
    expect(result).toEqual(testUser);
  });

  it(`should return for getUsersOwnedHubs`, async () => {
    // mock file for reuse
    const testUserId = 1;
    const testResults: JoinUserHub[] = [
      {
        user: { id: testUserId },
        hub: {
          id: 1,
          load: jest.fn().mockResolvedValue({
            name: 'hub1',
          })
        } as any,
        isOwner: true,
      } as JoinUserHub,
      {
        user: { id: testUserId },
        hub: {
          id: 2,
          load: jest.fn().mockResolvedValue({
            name: 'hub2',
          })
        } as any,
        isOwner: true,
      } as JoinUserHub,
    ];
    const hubResults: Hub[] = await Promise.all(testResults.map((x) => x.hub.load()));
    // notice we are pulling the repo variable and using jest.spyOn with no issues
    jest.spyOn(joinUserHubRepo, 'find').mockResolvedValueOnce(testResults as any);
    expect(await service.getUsersOwnedHubs(testUserId)).toEqual(hubResults);
  });

  it(`should return for memberOfHubs`, async () => {
    const testUserId = 1;
    const testResults: JoinUserHub[] = [
      {
        user: { id: testUserId },
        isOwner: false,
        hub: {
          load: jest.fn().mockResolvedValue({
            name: 'hub1',
          })
        } as any,
      } as JoinUserHub,
      {
        user: { id: testUserId },
        isOwner: false,
        hub: {
          load: jest.fn().mockResolvedValue({
            name: 'hub2',
          })
        } as any,
      } as JoinUserHub,
    ];
    const hubResults: Hub[] = await Promise.all(testResults.map((x) => x.hub.load()));
    // notice we are pulling the repo variable and using jest.spyOn with no issues
    jest.spyOn(joinUserHubRepo, 'find').mockResolvedValueOnce(testResults as any);
    expect(await service.memberOfHubs(testUserId)).toEqual(hubResults);
  });

  it('should return for editUserDetails', async () => {
    // Arrange
    const userId = 1;
    const testDetails = {
      firstName: 'FirstName',
      lastName: 'LastName',
      description: 'Description',
    } as EditUserDetails;
    const testUser = {
      id: userId,
      firstName: 'Gian',
      lastName: 'Lazzarini',
      description: 'Desc.',
    } as User;
    const expectedResult = {
      id: userId,
      firstName: testDetails.firstName,
      lastName: testDetails.lastName,
      description: testDetails.description,
    } as User;
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(testUser as any);
    jest.spyOn(userRepo, 'persistAndFlush').mockImplementationOnce(() => Promise.resolve());
    // Act
    const result = await service.editUserDetails(userId, testDetails);
    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should return for changeEmail', async () => {
    // Arrange
    const userId = 1;
    const newEmail = 'test@gmail.com';
    const testUser = {
      id: userId,
      firstName: 'Gian',
      email: 'gian@lazztech.com',
    } as User;
    const expectedResult = {
      id: userId,
      firstName: testUser.firstName,
      email: newEmail,
    } as User;
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(testUser as any);
    jest.spyOn(userRepo, 'persistAndFlush').mockImplementationOnce(() => Promise.resolve());
    // Act
    const result = await service.changeEmail(userId, newEmail);
    // Assert
    expect(result).toEqual(expectedResult);
  });

});
