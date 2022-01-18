import { HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Hub } from '../dal/entity/hub.entity';
import { InAppNotification } from '../dal/entity/inAppNotification.entity';
import { JoinUserHub } from '../dal/entity/joinUserHub.entity';
import { User } from '../dal/entity/user.entity';
import { UserDevice } from '../dal/entity/userDevice.entity';
import { FileServiceInterface } from '../file/interfaces/file-service.interface';
import { ImageFileService } from '../file/image-file/image-file.service';
import { NotificationService } from '../notification/notification.service';
import { HubService } from './hub.service';
import { Invite } from '../dal/entity/invite.entity';
import { LocalFileService } from '../file/local-file/local-file.service';
import { FILE_SERVICE } from '../file/file-service.token';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

describe('HubService', () => {
  let hubService: HubService;
  let joinUserHubRepo: EntityRepository<JoinUserHub>;
  let hubRepo: EntityRepository<Hub>;
  let fileService: FileServiceInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.local', '.env'],
          isGlobal: true,
        }),
        HttpModule,
      ],
      providers: [
        HubService,
        NotificationService,
        ImageFileService,
        {
          provide: FILE_SERVICE,
          useClass: LocalFileService,
        },
        NotificationService,
        {
          provide: getRepositoryToken(User),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(Hub),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(JoinUserHub),
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
          provide: getRepositoryToken(Invite),
          useClass: EntityRepository,
        },
      ],
    }).compile();

    hubService = module.get<HubService>(HubService);
    joinUserHubRepo = module.get<EntityRepository<JoinUserHub>>(
      getRepositoryToken(JoinUserHub),
    );
    hubRepo = module.get<EntityRepository<Hub>>(getRepositoryToken(Hub));
    fileService = module.get<FileServiceInterface>(FILE_SERVICE);
  });

  it('should be defined', () => {
    expect(hubService).toBeDefined();
  });

  it('should return for getOneUserHub', async () => {
    // Arrange
    const userId = 1;
    const hubId = 2;
    const userHubTestResult = {
      userId,
      hubId,
      hub: Promise.resolve({
        usersConnection: Promise.resolve([
          {
            user: {},
          },
        ]),
        microChats: Promise.resolve([{}]),
      }),
    } as JoinUserHub;
    jest
      .spyOn(joinUserHubRepo, 'findOne')
      .mockResolvedValueOnce(userHubTestResult);
    // Act
    await hubService.getOneUserHub(userId, hubId);
    // Assert
    expect(userHubTestResult).toEqual(userHubTestResult);
  });

  it('should return for getUserHubs', async () => {
    // Arrange
    const userId = 1;
    const testResult = [
      {
        userId,
        hub: Promise.resolve({
          usersConnection: {},
        }),
      } as JoinUserHub,
    ];
    jest.spyOn(joinUserHubRepo, 'find').mockResolvedValueOnce(testResult);
    // Act
    const result = await hubService.getUserHubs(userId);
    // Assert
    expect(result).toEqual(testResult);
  });

  it('should return for commonUserHubs', async () => {
    // Arrange
    const userId = 1;
    const otherUsersId = 2;
    const thirdUsersId = 3;
    jest.spyOn(joinUserHubRepo, 'find').mockResolvedValueOnce([
      {
        userId,
        hub: Promise.resolve({
          usersConnection: Promise.resolve([
            {
              userId,
            },
            {
              userId: otherUsersId,
            },
          ]),
        }),
      },
      {
        userId,
        hub: Promise.resolve({
          usersConnection: Promise.resolve([
            {
              userId,
            },
            {
              userId: thirdUsersId,
            },
          ]),
        }),
      },
    ] as JoinUserHub[]);
    const expectedResult = [
      {
        userId: otherUsersId,
      },
    ] as JoinUserHub[];
    // Act
    const result = await hubService.commonUsersHubs(userId, otherUsersId);
    // Assert
    expect(result).toStrictEqual(expectedResult);
  });

  it('should return for usersPeople', async () => {
    // Arrange
    const userId = 2;
    jest.spyOn(joinUserHubRepo, 'find').mockResolvedValueOnce([
      {
        userId: 2,
        hubId: 9,
        hub: Promise.resolve({
          id: 9,
          usersConnection: Promise.resolve([
            {
              userId: 3,
              user: Promise.resolve({
                id: 3,
              }),
            },
            {
              userId: 2,
              user: Promise.resolve({
                id: 2,
              }),
            },
          ]),
        }),
      } as JoinUserHub,
      {
        userId: 2,
        hubId: 10,
        hub: Promise.resolve({
          id: 10,
          usersConnection: Promise.resolve([
            {
              userId: 4,
              user: Promise.resolve({
                id: 4,
              }),
            },
            {
              userId: 2,
              user: Promise.resolve({
                id: 2,
              }),
            },
            {
              userId: 3,
              user: Promise.resolve({
                id: 3,
              }),
            },
          ]),
        }),
      } as JoinUserHub,
    ]);
    const expectedResult = [
      {
        id: 3,
      },
      {
        id: 4,
      },
    ] as User[];
    // Act
    const result = await hubService.usersPeople(userId);
    // Assert
    expect(result).toEqual(expectedResult);
  });

  it('should return for createHub', async () => {
    // Arrange
    const userId = 1;
    const hub = {
      id: 1,
      name: 'testName',
      description: 'description',
      image: 'image.png',
      latitude: 1,
      longitude: -1,
      shareableId: "b33d028f-c423-4137-a9e4-88be6976a7d3"
    } as Hub;
    const joinUserHub = {
      userId,
      hubId: hub.id,
      isOwner: true,
    } as JoinUserHub;
    const expectedResult = {
      userId,
      hubId: hub.id,
      isOwner: true,
      hub: Promise.resolve(hub),
    } as JoinUserHub;

    jest
      .spyOn(fileService, 'storeImageFromBase64')
      .mockResolvedValueOnce('https://x.com/' + hub.image);
    jest.spyOn(hubRepo, 'create').mockReturnValueOnce(hub);
    jest.spyOn(hubRepo, 'save').mockResolvedValueOnce(hub);

    jest.spyOn(joinUserHubRepo, 'create').mockReturnValueOnce(joinUserHub);
    const saveCall = jest
      .spyOn(joinUserHubRepo, 'save')
      .mockResolvedValueOnce(expectedResult);

    // Act
    const result = await hubService.createHub(userId, hub);

    // Assert
    expect(result).toEqual(expectedResult);
    expect(saveCall).toHaveBeenCalled();
  });

  it('should remove for deleteHub', async () => {
    // Arrange
    const userId = 1;
    const hubId = 1;
    jest.spyOn(joinUserHubRepo, 'findOne').mockResolvedValueOnce({
      userId,
      hubId,
      isOwner: true,
    } as JoinUserHub);
    jest.spyOn(hubRepo, 'findOne').mockResolvedValueOnce({
      image: 'imageTest',
    } as Hub);
    const deleteImageCall = jest
      .spyOn(fileService, 'delete')
      .mockImplementationOnce(() => Promise.resolve());
    const removeCall = jest
      .spyOn(hubRepo, 'remove')
      .mockResolvedValueOnce({} as Hub);
    // Act
    await hubService.deleteHub(1, 1);
    // Assert
    expect(deleteImageCall).toHaveBeenCalled();
    expect(removeCall).toHaveBeenCalled();
  });

  it('should return for editHub', async () => {
    // Arrange
    const userId = 1;
    const expectedResult = {
      id: 1,
      name: 'name',
      description: 'description',
    } as Hub;
    jest.spyOn(joinUserHubRepo, 'findOne').mockResolvedValueOnce({
      userId,
      hubId: expectedResult.id,
      isOwner: true,
      hub: Promise.resolve(expectedResult),
    } as JoinUserHub);
    const saveCall = jest
      .spyOn(hubRepo, 'save')
      .mockResolvedValueOnce(expectedResult);
    // Act
    const result = await hubService.editHub(
      userId,
      expectedResult.id,
      expectedResult.name,
      expectedResult.description,
    );
    // Assert
    expect(result).toEqual(expectedResult);
    expect(saveCall).toHaveBeenCalled();
  });

  it('should return for changeHubImage', async () => {
    // Arrange
    const userId = 1;
    const hubId = 1;
    const newImage = 'newImage';
    jest.spyOn(joinUserHubRepo, 'findOne').mockResolvedValueOnce({
      userId,
      hubId,
      isOwner: true,
      hub: Promise.resolve({
        image: 'oldImage',
      } as Hub),
    } as JoinUserHub);
    const expectedResult = {
      id: hubId,
      image: newImage,
    } as Hub;
    const deleteCall = jest
      .spyOn(fileService, 'delete')
      .mockImplementationOnce(() => Promise.resolve());
    const storeCall = jest
      .spyOn(fileService, 'storeImageFromBase64')
      .mockResolvedValueOnce(expectedResult.image);
    const saveCall = jest
      .spyOn(hubRepo, 'save')
      .mockResolvedValueOnce(expectedResult);
    // Act
    const result = await hubService.changeHubImage(userId, hubId, newImage);
    // Assert
    expect(result).toEqual(expectedResult);
    expect(deleteCall).toHaveBeenCalled();
    expect(storeCall).toHaveBeenCalled();
    expect(saveCall).toHaveBeenCalled();
  });

  it('should resolve for setHubStarred', async () => {
    // Arrange
    const userId = 1;
    const hubId = 1;
    const expectedResult = {
      userId,
      hubId,
      starred: true,
    } as JoinUserHub;
    jest.spyOn(joinUserHubRepo, 'findOne').mockResolvedValueOnce({
      userId,
      hubId,
    } as JoinUserHub);
    const saveCall = jest
      .spyOn(joinUserHubRepo, 'save')
      .mockResolvedValueOnce(expectedResult);
    // Act
    const result = await hubService.setHubStarred(userId, hubId);
    // Assert
    expect(result).toEqual(expectedResult);
    expect(saveCall).toHaveBeenCalled();
  });

  it('should resolve for setHubNotStarred', async () => {
    // Arrange
    const userId = 1;
    const hubId = 1;
    const expectedResult = {
      userId,
      hubId,
      starred: false,
    } as JoinUserHub;
    jest.spyOn(joinUserHubRepo, 'findOne').mockResolvedValueOnce({
      userId,
      hubId,
    } as JoinUserHub);
    const saveCall = jest
      .spyOn(joinUserHubRepo, 'save')
      .mockResolvedValueOnce(expectedResult);
    // Act
    const result = await hubService.setHubNotStarred(userId, hubId);
    // Assert
    expect(result).toEqual(expectedResult);
    expect(saveCall).toHaveBeenCalled();
  });

  it('should return for searchHubByName', async () => {
    // Arrange
    const userId = 1;
    const search = 'Lazzarini';
    const testHubRelationships: JoinUserHub[] = [
      {
        userId,
        hub: Promise.resolve({
          name: 'a',
        }),
      } as JoinUserHub,
      {
        userId,
        hub: Promise.resolve({
          name: 'b',
        }),
      } as JoinUserHub,
      {
        userId,
        hub: Promise.resolve({
          name: 'Lazzarini',
        }),
      } as JoinUserHub,
    ];
    const expectedResult = [
      {
        name: 'Lazzarini',
      } as Hub,
    ];
    jest
      .spyOn(joinUserHubRepo, 'find')
      .mockResolvedValueOnce(testHubRelationships);
    // Act
    const result = await hubService.searchHubByName(userId, search);
    // Assert
    expect(result).toEqual(expectedResult);
  });
});
