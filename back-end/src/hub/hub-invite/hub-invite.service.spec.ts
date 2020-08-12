import { Test, TestingModule } from '@nestjs/testing';
import { HubInviteService } from './hub-invite.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { HttpModule } from '@nestjs/common';
import { Invite } from 'src/dal/entity/invite.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/dal/entity/user.entity';
import { JoinUserHub } from 'src/dal/entity/joinUserHub.entity';
import { NotificationService } from 'src/notification/notification.service';
import { InAppNotification } from 'src/dal/entity/inAppNotification.entity';
import { JoinUserInAppNotifications } from 'src/dal/entity/joinUserInAppNotifications.entity';
import { UserDevice } from 'src/dal/entity/userDevice.entity';

describe('HubInviteService', () => {
  let service: HubInviteService;
  let inviteRepo: Repository<Invite>;
  let joinUserHubRepo: Repository<JoinUserHub>;
  let userRepo: Repository<User>;
  let notificationService: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
        HttpModule,
      ],
      providers: [
        HubInviteService,
        NotificationService,
        {
          provide: getRepositoryToken(Invite),
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

    service = module.get<HubInviteService>(HubInviteService);
    inviteRepo = module.get<Repository<Invite>>(getRepositoryToken(Invite));
    joinUserHubRepo = module.get<Repository<JoinUserHub>>(
      getRepositoryToken(JoinUserHub),
    );
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
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
      hubId,
      invitersId: userId,
      inviteesId: invitee.id,
    } as Invite;

    const mockedFindOneJoinUserHub = {
      userId,
      hubId,
      isOwner: true,
      hub: Promise.resolve({
        id: hubId,
        name: 'testHub',
        image: 'testImage.png',
      }),
    } as JoinUserHub;
    jest
      .spyOn(joinUserHubRepo, 'findOne')
      .mockResolvedValueOnce(mockedFindOneJoinUserHub);
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(invitee);
    jest.spyOn(inviteRepo, 'create').mockReturnValueOnce(invite);

    const addInAppNotificationForUserCall = jest
      .spyOn(notificationService, 'addInAppNotificationForUser')
      .mockImplementationOnce(() => Promise.resolve());
    const sendPushToUser = jest
      .spyOn(notificationService, 'sendPushToUser')
      .mockImplementationOnce(() => Promise.resolve());

    const saveCall = jest
      .spyOn(inviteRepo, 'save')
      .mockResolvedValueOnce(invite);
    // Act
    await service.inviteUserToHub(userId, hubId, invitee.email);
    // Assert
    expect(saveCall).toHaveBeenCalled();
    expect(addInAppNotificationForUserCall).toHaveBeenCalledWith(
      invitee.id,
      expect.objectContaining({
        thumbnail: (await mockedFindOneJoinUserHub.hub).image,
        header: `You're invited to "${
          (await mockedFindOneJoinUserHub.hub).name
        }" hub.`,
        text: `View the invite.`,
        // date: Date.now().toString(),
        actionLink: `preview-hub/${mockedFindOneJoinUserHub.hubId}`,
      }),
    );
    expect(sendPushToUser).toHaveBeenCalledWith(
      invitee.id,
      expect.objectContaining({
        title: `You're invited to "${
          (await mockedFindOneJoinUserHub.hub).name
        }" hub.`,
        body: `View the invite.`,
        click_action: `preview-hub/${(await mockedFindOneJoinUserHub.hub).id}`,
      }),
    );
  });
});
