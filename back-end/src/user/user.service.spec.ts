import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Hub } from 'src/dal/entity/hub.entity';
import { JoinUserHub } from 'src/dal/entity/joinUserHub.entity';
import { User } from 'src/dal/entity/user.entity';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { FileService } from 'src/services/file/file.service';
import { EmailService } from 'src/services/email/email.service';
import { Invite } from 'src/dal/entity/invite.entity';
import { ConfigService } from '@nestjs/config';
import { PasswordReset } from 'src/dal/entity/passwordReset.entity';
import { EditUserDetails } from './dto/editUserDetails.input';
import { ImageFileService } from 'src/services/file/image-file/image-file.service';

describe('UserService', () => {
  let service: UserService;
  let joinUserHubRepo: Repository<JoinUserHub>;
  let userRepo: Repository<User>;
  let inviteRepo: Repository<Invite>;
  let emailService: EmailService;
  let fileService: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        ImageFileService,
        FileService,
        EmailService,
        ConfigService,
        {
          provide: getRepositoryToken(PasswordReset),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(JoinUserHub),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Invite),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    // Save the instance of the repository and set the correct generics
    joinUserHubRepo = module.get<Repository<JoinUserHub>>(
      getRepositoryToken(JoinUserHub),
    );
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    inviteRepo = module.get<Repository<Invite>>(getRepositoryToken(Invite));
    emailService = module.get<EmailService>(EmailService);
    fileService = module.get<FileService>(FileService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should return for getUser', async () => {
    //Arrange
    const userId = 1;
    const testUser = {
      id: userId,
      firstName: 'Test',
      lastName: 'Test',
    } as User;
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(testUser);
    //Act
    const result = await service.getUser(userId);
    //Assert
    expect(result).toEqual(testUser);
  });

  it(`should return for getUsersOwnedHubs`, async () => {
    // mock file for reuse
    const testUserId = 1;
    const testResults: JoinUserHub[] = [
      {
        userId: testUserId,
        hubId: 1,
        user: {},
        hub: {
          name: 'hub1',
        } as Hub,
        isOwner: true,
      } as JoinUserHub,
      {
        userId: testUserId,
        hubId: 2,
        user: {},
        hub: {
          name: 'hub2',
        } as Hub,
        isOwner: true,
      } as JoinUserHub,
    ];
    const hubResults: Hub[] = testResults.map(x => x.hub);
    // notice we are pulling the repo variable and using jest.spyOn with no issues
    jest.spyOn(joinUserHubRepo, 'find').mockResolvedValueOnce(testResults);
    expect(await service.getUsersOwnedHubs(testUserId)).toEqual(hubResults);
  });

  it(`should return for memberOfHubs`, async () => {
    const testUserId = 1;
    const testResults: JoinUserHub[] = [
      {
        userId: testUserId,
        isOwner: false,
        hub: {
          name: 'hub1',
        } as Hub,
      } as JoinUserHub,
      {
        userId: testUserId,
        isOwner: false,
        hub: {
          name: 'hub2',
        } as Hub,
      } as JoinUserHub,
    ];
    const hubResults: Hub[] = testResults.map(x => x.hub);
    // notice we are pulling the repo variable and using jest.spyOn with no issues
    jest.spyOn(joinUserHubRepo, 'find').mockResolvedValueOnce(testResults);
    expect(await service.memberOfHubs(testUserId)).toEqual(hubResults);
  });

  it('should return for editUserDetails', async () => {
    //Arrange
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
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(testUser);
    jest.spyOn(userRepo, 'save').mockResolvedValueOnce(expectedResult);
    //Act
    const result = await service.editUserDetails(userId, testDetails);
    //Assert
    expect(result).toEqual(expectedResult);
  });

  it('should return for changeEmail', async () => {
    //Arrange
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
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(testUser);
    jest.spyOn(userRepo, 'save').mockResolvedValueOnce(expectedResult);
    //Act
    const result = await service.changeEmail(userId, newEmail);
    //Assert
    expect(result).toEqual(expectedResult);
  });

  it('should return for changeUserImage', async () => {
    //Arrange
    const userId = 1;
    const newImage = 'MockBase64String';
    const testUser = {
      id: userId,
      image: 'oldIMage',
    } as User;
    const expectedResult = {
      id: userId,
      image: `https://x.com/${newImage}.png`,
    } as User;
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(testUser);
    const deletePublicImageMock = jest
      .spyOn(fileService, 'deletePublicImageFromUrl')
      .mockImplementation(() => Promise.resolve());
    jest
      .spyOn(fileService, 'storePublicImageFromBase64')
      .mockResolvedValueOnce(expectedResult.image);
    jest.spyOn(userRepo, 'save').mockResolvedValueOnce(expectedResult);
    //Act
    const result = await service.changeUserImage(userId, newImage);
    //Assert
    expect(deletePublicImageMock).toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
  });
});
