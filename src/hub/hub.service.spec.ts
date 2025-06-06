import { HttpModule } from '@nestjs/axios';
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
import { Block } from '../dal/entity/block.entity';
import { File } from '../dal/entity/file.entity';
import { JoinHubFile } from '../dal/entity/joinHubFile.entity';

describe('HubService', () => {
  let hubService: HubService;
  let joinUserHubRepo: EntityRepository<JoinUserHub>;
  let blockRepo: EntityRepository<Block>;
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
        {
          provide: getRepositoryToken(Block),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(File),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(JoinHubFile),
          useClass: EntityRepository,
        },
      ],
    }).compile();

    hubService = module.get<HubService>(HubService);
    joinUserHubRepo = module.get<EntityRepository<JoinUserHub>>(
      getRepositoryToken(JoinUserHub),
    );
    blockRepo = module.get<EntityRepository<Block>>(
      getRepositoryToken(Block)
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
      user: { id: userId },
      hub: {
        id: hubId,
        usersConnection: [
          {
            user: {},
          },
        ] as any,
        microChats: [{}],
      } as any,
    } as JoinUserHub;
    jest
      .spyOn(joinUserHubRepo, 'findOneOrFail')
      .mockResolvedValueOnce(userHubTestResult as any);
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
        user: { id: userId },
        hub: {
          load: jest.fn().mockResolvedValueOnce({
            usersConnection: {
              load: jest.fn().mockResolvedValueOnce({})
            }
          }),
        } as any,
      } as JoinUserHub,
    ];
    jest.spyOn(joinUserHubRepo, 'find').mockResolvedValueOnce(testResult as any);
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
        user: { id: userId },
        hub: {
          load: jest.fn().mockResolvedValueOnce({
            usersConnection: {
              loadItems: jest.fn().mockResolvedValueOnce([
                {
                  user: { id: userId },
                },
                {
                  user: { id: otherUsersId },
                },
              ] as any,)
            }
          })
        },
      },
      {
        user: { id: userId },
        hub: {
          load: jest.fn().mockResolvedValueOnce({
            usersConnection: {
              loadItems: jest.fn().mockResolvedValue([
                {
                  user: { id: userId },
                },
                {
                  user: { id: thirdUsersId },
                },
              ] as any,)
            }
          })
        } as any,
      },
    ] as any[]);
    const expectedResult = [
      {
        user: { id: otherUsersId },
      },
    ] as JoinUserHub[];
    // Act
    const result = await hubService.commonUsersHubs(userId, otherUsersId);
    // Assert
    expect(result).toStrictEqual(expectedResult);
  });

  it('should return only unblocked users for usersPeople', async () => {
    // Arrange
    const user = {
      id: 2,
      load: jest.fn().mockResolvedValue({
        id: 2,
      })
    };
    const firstCommonUser = {
      id: 3,
      load: jest.fn().mockResolvedValue({
        id: 3,
      })
    };
    const secondCommonUser = {
      id: 4,
      load: jest.fn().mockResolvedValue({
        id: 4,
      })
    };
    const userWhoBlockedMe = {
      id: 13,
      load: jest.fn().mockResolvedValue({
        id: 13,
      })
    };
    const mockBlocks = [
      {
        from: { id: userWhoBlockedMe.id },
        to: { id: user.id }
      }
    ] as Array<Block>;
    jest.spyOn(blockRepo, 'find')
      .mockResolvedValueOnce(mockBlocks as any);
    jest.spyOn(joinUserHubRepo, 'find').mockResolvedValueOnce([
      {
        user: { id: user.id },
        hub: {
          id: 9,
          load: jest.fn().mockResolvedValueOnce({
            id: 9,
            usersConnection: {
              loadItems: jest.fn().mockResolvedValueOnce([
                {
                  user: firstCommonUser,
                },
                {
                  user,
                },
                {
                  user: userWhoBlockedMe
                }
              ] as any)
            }
          }),
        } as any,
      } as JoinUserHub,
      {
        user: { id: user.id },
        hub: {
          id: 10,
          load: jest.fn().mockResolvedValueOnce({
            id: 10,
            usersConnection: {
              loadItems: jest.fn().mockResolvedValueOnce([
                {
                  user: secondCommonUser,
                },
                {
                  user,
                },
                {
                  user: firstCommonUser,
                },
              ])
            },
          })
        } as any,
      } as JoinUserHub,
    ] as any);

    // Act
    const result = await hubService.usersPeople(user.id);
    // Assert
    expect(result).toEqual([
      {
        id: firstCommonUser.id,
      },
      {
        id: secondCommonUser.id,
      },
    ] as User[]);
  });

  it('should return for createHub', async () => {
    // Arrange
    const userId = 1;
    const hub = {
      id: 1,
      name: 'testName',
      description: 'description',
      latitude: 1,
      longitude: -1,
      shareableId: "b33d028f-c423-4137-a9e4-88be6976a7d3"
    } as Hub;
    const image = {} as File;
    const joinUserHub = {
      user: { id: userId },
      hub: { id: hub.id },
      isOwner: true,
    } as JoinUserHub;
    const expectedResult = {
      user: { id: userId },
      hub: { ...hub as any, id: hub.id, coverImage: image },
      isOwner: true,
    } as JoinUserHub;

    jest.spyOn(fileService, 'storeImageFromFileUpload').mockResolvedValueOnce(image);
    jest.spyOn(hubRepo, 'create').mockReturnValueOnce(hub as any);
    jest.spyOn(hubRepo, 'persistAndFlush').mockImplementationOnce(() => Promise.resolve());

    jest.spyOn(joinUserHubRepo, 'create').mockReturnValueOnce({...joinUserHub, hub} as any);
    const saveCall = jest
      .spyOn(joinUserHubRepo, 'persistAndFlush')
      .mockImplementationOnce(() => Promise.resolve());

    // Act
    const result = await hubService.createHub(userId, hub, image as any);

    // Assert
    expect(result).toEqual(expectedResult);
    expect(saveCall).toHaveBeenCalled();
  });

  it('should remove for deleteHub', async () => {
    // Arrange
    const userId = 1;
    const hubId = 1;
    jest.spyOn(joinUserHubRepo, 'findOne').mockResolvedValueOnce({
      user: { id: userId },
      hub: { id: hubId },
      isOwner: true,
    } as any);
    jest.spyOn(hubRepo, 'findOne').mockResolvedValueOnce({
      coverImage: { load: jest.fn().mockResolvedValueOnce({ fileName: 'imageTest' }) },
    } as any);
    const deleteImageCall = jest
      .spyOn(fileService, 'delete')
      .mockImplementation(() => Promise.resolve());
    const removeCall = jest
      .spyOn(hubRepo, 'removeAndFlush')
      .mockImplementationOnce(() => Promise.resolve());
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
      user: { id: userId },
      isOwner: true,
      hub: {
        id: expectedResult.id,
        load: jest.fn().mockResolvedValueOnce(expectedResult as any)
      } as any,
    } as any);
    const saveCall = jest
      .spyOn(hubRepo, 'persistAndFlush')
      .mockImplementationOnce(() => Promise.resolve());
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

  it('should resolve for setHubStarred', async () => {
    // Arrange
    const userId = 1;
    const hubId = 1;
    const expectedResult = {
      user: { id: userId },
      hub: { id: hubId },
      starred: true,
    } as JoinUserHub;
    jest.spyOn(joinUserHubRepo, 'findOne').mockResolvedValueOnce({
      user: { id: userId },
      hub: { id: hubId },
    } as any);
    const saveCall = jest
      .spyOn(joinUserHubRepo, 'persistAndFlush')
      .mockImplementationOnce(() => Promise.resolve());
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
      user: { id: userId },
      hub: { id: hubId },
      starred: false,
    } as JoinUserHub;
    jest.spyOn(joinUserHubRepo, 'findOne').mockResolvedValueOnce({
      user: { id: userId },
      hub: { id: hubId },
    } as any);
    const saveCall = jest
      .spyOn(joinUserHubRepo, 'persistAndFlush')
      .mockImplementationOnce(() => Promise.resolve());
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
        user: { id: userId },
        hub: {
          load: jest.fn().mockResolvedValueOnce({
            name: 'a',
          })
        } as any,
      } as JoinUserHub,
      {
        user: { id: userId },
        hub: {
          load: jest.fn().mockResolvedValueOnce({
            name: 'b',
          })
        } as any,
      } as JoinUserHub,
      {
        user: { id: userId },
        hub: {
          load: jest.fn().mockResolvedValueOnce({
            name: 'Lazzarini',
          })
        } as any,
      } as JoinUserHub,
    ];
    const expectedResult = [
      {
        name: 'Lazzarini',
      } as Hub,
    ];
    jest
      .spyOn(joinUserHubRepo, 'find')
      .mockResolvedValueOnce(testHubRelationships as any);
    // Act
    const result = await hubService.searchHubByName(userId, search);
    // Assert
    expect(result).toEqual(expectedResult);
  });
});
