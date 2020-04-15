import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import configuration from 'src/config/configuration';
import { Hub } from 'src/dal/entity/hub.entity';
import { InAppNotification } from 'src/dal/entity/inAppNotification.entity';
import { JoinUserHub } from 'src/dal/entity/joinUserHub.entity';
import { JoinUserInAppNotifications } from 'src/dal/entity/joinUserInAppNotifications.entity';
import { User } from 'src/dal/entity/user.entity';
import { FileService } from 'src/services/file/file.service';
import { Repository } from 'typeorm';
import { NotificationService } from '../notification/notification.service';
import { HubService } from './hub.service';
import { HttpModule } from '@nestjs/common';
import { UserDevice } from 'src/dal/entity/userDevice.entity';

describe('HubService', () => {
  let hubService: HubService;
  let joinUserHubRepo: Repository<JoinUserHub>;
  let userRepo: Repository<User>;
  let hubRepo: Repository<Hub>;
  let fileService: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
        HttpModule
      ],
      providers: [
        HubService,
        NotificationService,
        FileService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Hub),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(JoinUserHub),
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
      ],
    }).compile();

    hubService = module.get<HubService>(HubService);
    joinUserHubRepo = module.get<Repository<JoinUserHub>>(getRepositoryToken(JoinUserHub));
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    hubRepo = module.get<Repository<Hub>>(getRepositoryToken(Hub));
    fileService = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(hubService).toBeDefined();
  });

  it('should return for getOneUserHub', async () => {
    //Arrange
    const userId = 1;
    const hubId = 2;
    const userHubTestResult = {
      userId,
      hubId,
      hub: {
        usersConnection: [{
          user: {}
        }],
        microChats: [
          {}
        ]
      }
    } as JoinUserHub;
    jest.spyOn(joinUserHubRepo, 'findOne').mockResolvedValueOnce(userHubTestResult);
    //Act
    const result = await hubService.getOneUserHub(userId, hubId);
    //Assert
    expect(userHubTestResult).toEqual(userHubTestResult);
  });

  it('should return for getUserHubs', async () => {
    //Arrange
    const userId = 1;
    const testResult = [
        {
        userId,
        hub: {
          usersConnection: {

          }
        }
      } as JoinUserHub,
    ];
    jest.spyOn(joinUserHubRepo, 'find').mockResolvedValueOnce(testResult);
    //Act
    const result = await hubService.getUserHubs(userId);
    //Assert
    expect(result).toEqual(testResult);
  });

  it('should return for commonUserHubs', async () => {
    //Arrange
    const userId = 1;
    const otherUsersId = 2;
    const thirdUsersId = 3;
    jest.spyOn(joinUserHubRepo, 'find').mockResolvedValueOnce([
      {
        userId,
        hub: {
          usersConnection: [
            {
              userId
            },
            {
              userId: otherUsersId
            }
          ]
        }
      },
      {
        userId,
        hub: {
          usersConnection: [
            {
              userId
            },
            {
              userId: thirdUsersId
            }
          ]
        }
      }
    ] as JoinUserHub[]);
    const expectedResult = [
      {
        userId: otherUsersId
      }
    ] as JoinUserHub[];
    //Act
    const result = await hubService.commonUsersHubs(userId, otherUsersId);
    //Assert
    expect(result).toStrictEqual(expectedResult);
  });

  it('should create new invite for inviteUserToHub', async () => {
    //Arrange
    const userId = 1;
    const hubId = 1;
    const invitee = {
      id: 2,
      email: "inviteesemail@mail.com"
    } as User;

    const invite = {
      userId: invitee.id,
      hubId,
      isOwner: false,
    } as JoinUserHub;

    jest.spyOn(joinUserHubRepo, 'findOne').mockResolvedValueOnce({
      userId,
      hubId,
      isOwner: true,
    } as JoinUserHub);
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(invitee);
    jest.spyOn(joinUserHubRepo, 'create').mockReturnValueOnce(invite)
    const saveCall = jest.spyOn(joinUserHubRepo, 'save').mockResolvedValueOnce(invite);
    //Act
    await hubService.inviteUserToHub(userId, hubId, invitee.email);
    //Assert
    expect(saveCall).toHaveBeenCalled();
  });

  it('should return for usersPeople', async () => {
    //Arrange
    const userId = 2;
    jest.spyOn(joinUserHubRepo, 'find').mockResolvedValueOnce([
      {
        userId: 2,
        hubId: 9,
        hub: {
          id: 9,
          usersConnection: [
            {
              userId: 3,
              user: {
                id: 3
              }
            },
            {
              userId: 2,
              user: {
                id: 2
              }
            }
          ]
        }
      } as JoinUserHub,
      {
        userId: 2,
        hubId: 10,
        hub: {
          id: 10,
          usersConnection: [
            {
              userId: 4,
              user: {
                id: 4
              }
            },
            {
              userId: 2,
              user: {
                id: 2
              }
            },
            {
              userId: 3,
              user: {
                id: 3
              }
            }
          ]
        }
      } as JoinUserHub
    ]);
    const expectedResult = [
      {
        id: 3
      },
      {
        id: 4
      }
    ] as User[];
    //Act
    const result = await hubService.usersPeople(userId);
    //Assert
    expect(result).toEqual(expectedResult);
  });

  it('should return for createHub', async () => {
    //Arrange
    const userId = 1;
    const hub = {
      id: 1,
      name: "testName", 
      description: "description", 
      image: "image.png", 
      latitude: 1, 
      longitude: -1
    } as Hub;
    const joinUserHub = {
      userId,
      hubId: hub.id,
      isOwner: true
    } as JoinUserHub;
    jest.spyOn(fileService, 'storePublicImageFromBase64').mockResolvedValueOnce('https://x.com/' + hub.image);
    jest.spyOn(hubRepo, 'save').mockResolvedValueOnce(hub);
    jest.spyOn(joinUserHubRepo, 'create').mockReturnValueOnce(joinUserHub)
    const saveCall = jest.spyOn(joinUserHubRepo, 'save').mockResolvedValueOnce(joinUserHub);
    //Act
    const result = await hubService.createHub(userId, hub);
    //Assert
    expect(result).toEqual(hub);
    expect(saveCall).toHaveBeenCalled();
  });

  it('should remove for deleteHub', async () => {
    //Arrange
    const userId = 1;
    const hubId = 1;
    jest.spyOn(joinUserHubRepo, 'findOne').mockResolvedValueOnce({
      userId,
      hubId,
      isOwner: true,
    } as JoinUserHub);
    jest.spyOn(hubRepo, 'findOne').mockResolvedValueOnce({
      image: "imageTest"
    } as Hub);
    const deleteImageCall = jest.spyOn(fileService, 'deletePublicImageFromUrl').mockImplementationOnce(
      () => Promise.resolve()
    );
    const removeCall = jest.spyOn(hubRepo, 'remove').mockResolvedValueOnce({} as Hub);
    //Act
    await hubService.deleteHub(1, 1);
    //Assert
    expect(deleteImageCall).toHaveBeenCalled();
    expect(removeCall).toHaveBeenCalled();
  });

  it('should return for editHub', async () => {
    //Arrange
    const userId = 1;
    const expectedResult = {
      id: 1,
      name: "name",
      description: "description",
    } as Hub;
    jest.spyOn(joinUserHubRepo, 'findOne').mockResolvedValueOnce({
      userId,
      hubId: expectedResult.id,
      isOwner: true,
      hub: expectedResult
    } as JoinUserHub);
    const saveCall = jest.spyOn(hubRepo, 'save').mockResolvedValueOnce(expectedResult);
    //Act
    const result = await hubService.editHub(
      userId, 
      expectedResult.id,
      expectedResult.name,
      expectedResult.description
      );
    //Assert
    expect(result).toEqual(expectedResult);
    expect(saveCall).toHaveBeenCalled();
  });

  it('should return for changeHubImage', async () => {
    //Arrange
    const userId = 1;
    const hubId = 1;
    const newImage = "newImage";
    jest.spyOn(joinUserHubRepo, 'findOne').mockResolvedValueOnce({
      userId,
      hubId,
      isOwner: true,
      hub: {
        image: "oldImage"
      } as Hub
    } as JoinUserHub);
    const expectedResult = {
      id: hubId,
      image: newImage
    } as Hub;
    const deleteCall = jest.spyOn(fileService, 'deletePublicImageFromUrl').mockImplementationOnce(
      () => Promise.resolve()
    );
    const storeCall = jest.spyOn(fileService, 'storePublicImageFromBase64').mockResolvedValueOnce(
      expectedResult.image
    );
    const saveCall = jest.spyOn(hubRepo, 'save').mockResolvedValueOnce(expectedResult);
    //Act
    const result = await hubService.changeHubImage(userId, hubId, newImage);
    //Assert
    expect(result).toEqual(expectedResult);
    expect(deleteCall).toHaveBeenCalled();
    expect(storeCall).toHaveBeenCalled();
    expect(saveCall).toHaveBeenCalled();
  });

  it('should save for joinHub', async () => {
    //Arrange
    const userId = 1;
    const hubId = 1;
    const expectedResult = {
      userId,
      hubId,
      isOwner: true
    } as JoinUserHub;
    jest.spyOn(joinUserHubRepo, 'create').mockReturnValueOnce(expectedResult);
    const saveCall = jest.spyOn(joinUserHubRepo, 'save').mockResolvedValueOnce(expectedResult);
    //Act
    const result = await hubService.joinHub(userId, hubId);
    //Assert
    expect(result).toEqual(expectedResult);
    expect(saveCall).toHaveBeenCalled();
  });

  it('should resolve for setHubStarred', async () => {
    //Arrange
    const userId = 1;
    const hubId = 1;
    const expectedResult = {
      userId,
      hubId,
      starred: true,
    } as JoinUserHub;
    jest.spyOn(joinUserHubRepo, 'findOne').mockResolvedValueOnce({
      userId,
      hubId
    } as JoinUserHub);
    const saveCall = jest.spyOn(joinUserHubRepo, 'save').mockResolvedValueOnce(expectedResult);
    //Act
    const result = await hubService.setHubStarred(userId, hubId);
    //Assert
    expect(result).toEqual(expectedResult);
    expect(saveCall).toHaveBeenCalled();
  });

  it('should resolve for setHubNotStarred', async () => {
    //Arrange
    const userId = 1;
    const hubId = 1;
    const expectedResult = {
      userId,
      hubId,
      starred: false,
    } as JoinUserHub;
    jest.spyOn(joinUserHubRepo, 'findOne').mockResolvedValueOnce({
      userId,
      hubId
    } as JoinUserHub);
    const saveCall = jest.spyOn(joinUserHubRepo, 'save').mockResolvedValueOnce(expectedResult);
    //Act
    const result = await hubService.setHubNotStarred(userId, hubId);
    //Assert
    expect(result).toEqual(expectedResult);
    expect(saveCall).toHaveBeenCalled();
  });

  it('should return for searchHubByName', async () => {
    //Arrange
    const userId = 1;
    const search = "Lazzarini";
    const testHubRelationships: Array<JoinUserHub> = [
      {
        userId,
        hub: {
          name: "a"
        }
      } as JoinUserHub,
      {
        userId,
        hub: {
          name: "b"
        }
      } as JoinUserHub,
      {
        userId,
        hub: {
          name: "Lazzarini"
        }
      } as JoinUserHub,
    ];
    const expectedResult = [
      {
        name: "Lazzarini"
      } as Hub
    ];
    jest.spyOn(joinUserHubRepo, 'find').mockResolvedValueOnce(testHubRelationships);
    //Act
    const result = await hubService.searchHubByName(userId, search);
    //Assert
    expect(result).toEqual(expectedResult);
  });

});
