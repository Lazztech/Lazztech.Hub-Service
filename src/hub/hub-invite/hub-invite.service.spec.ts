import { Test, TestingModule } from '@nestjs/testing';
import { HubInviteService } from './hub-invite.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Invite } from '../../dal/entity/invite.entity';
import { User } from '../../dal/entity/user.entity';
import { JoinUserHub } from '../../dal/entity/joinUserHub.entity';
import { NotificationService } from '../../notification/notification.service';
import { InAppNotification } from '../../dal/entity/inAppNotification.entity';
import { UserDevice } from '../../dal/entity/userDevice.entity';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

describe('HubInviteService', () => {
  let service: HubInviteService;
  let inviteRepo: EntityRepository<Invite>;
  let joinUserHubRepo: EntityRepository<JoinUserHub>;
  let userRepo: EntityRepository<User>;
  let notificationService: NotificationService;

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
        HubInviteService,
        NotificationService,
        {
          provide: getRepositoryToken(Invite),
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
          provide: getRepositoryToken(InAppNotification),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(UserDevice),
          useClass: EntityRepository,
        },
      ],
    }).compile();

    service = module.get<HubInviteService>(HubInviteService);
    inviteRepo = module.get<EntityRepository<Invite>>(getRepositoryToken(Invite));
    joinUserHubRepo = module.get<EntityRepository<JoinUserHub>>(
      getRepositoryToken(JoinUserHub),
    );
    userRepo = module.get<EntityRepository<User>>(getRepositoryToken(User));
    notificationService = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new invite for inviteUserToHub', async () => {
    // Arrange
    const userId = 1;
    const hubId = 1;
    const invitee = {
      id: 2,
      email: 'inviteesemail@mail.com',
    } as User;

    const invite = {
      hub: {
        id: hubId
      },
      inviter: {
        id: userId
      },
      invitee: {
        id: invitee.id
      },
    } as Invite;

    const mockedFindOneJoinUserHub = {
      user: {
        id: userId,
      },
      isOwner: true,
      hub: {
        id: hubId,
        load: jest.fn().mockResolvedValue({
          id: hubId,
          name: 'testHub',
          coverImage: {
            load: jest.fn().mockResolvedValue({ fileName: 'testImage.png'})
          },
        }) as any
      },
    } as JoinUserHub;
    jest
      .spyOn(joinUserHubRepo, 'findOne')
      .mockResolvedValueOnce(mockedFindOneJoinUserHub as any);
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(invitee as any);
    jest.spyOn(inviteRepo, 'findOne').mockResolvedValueOnce(undefined);
    jest.spyOn(inviteRepo, 'create').mockReturnValueOnce(invite as any);

    const addInAppNotificationForUserCall = jest
      .spyOn(notificationService, 'addInAppNotificationForUser')
      .mockImplementationOnce(() => Promise.resolve());
    const sendPushToUser = jest
      .spyOn(notificationService, 'sendPushToUser')
      .mockImplementationOnce(() => Promise.resolve());

    const saveCall = jest
      .spyOn(inviteRepo, 'persistAndFlush')
      .mockImplementationOnce(() => Promise.resolve());
    // Act
    await service.inviteUserToHub(userId, hubId, invitee.email);
    // Assert
    expect(saveCall).toHaveBeenCalled();
    expect(addInAppNotificationForUserCall).toHaveBeenCalledWith(
      invitee.id,
      expect.objectContaining({
        thumbnail: (await (await mockedFindOneJoinUserHub.hub.load()).coverImage.load()).fileName,
        header: `You're invited to "${
          (await mockedFindOneJoinUserHub.hub.load()).name
        }" hub.`,
        text: `View the invite.`,
        // date: Date.now().toString(),
        actionLink: `preview-hub/${mockedFindOneJoinUserHub.hub.id}`,
      }),
    );
    expect(sendPushToUser).toHaveBeenCalledWith(
      invitee.id,
      expect.objectContaining({
        title: `You're invited to "${
          (await mockedFindOneJoinUserHub.hub.load()).name
        }" hub.`,
        body: `View the invite.`,
        click_action: `preview-hub/${(await mockedFindOneJoinUserHub.hub.load()).id}`,
      }),
    );
  });
});
