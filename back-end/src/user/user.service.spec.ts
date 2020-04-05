import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Hub } from 'src/dal/entity/hub.entity';
import { JoinUserHub } from 'src/dal/entity/joinUserHub.entity';
import { User } from 'src/dal/entity/user.entity';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { FileService } from 'src/services/file.service';
import { EmailService } from 'src/services/email/email.service';
import { Invite } from 'src/dal/entity/invite.entity';
import { ConfigService } from '@nestjs/config';
import { PasswordReset } from 'src/dal/entity/passwordReset.entity';

describe('UserService', () => {
  let service: UserService;
  let joinUserHubRepo: Repository<JoinUserHub>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
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
    joinUserHubRepo = module.get<Repository<JoinUserHub>>(getRepositoryToken(JoinUserHub));
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
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
          name: "hub1"
        } as Hub,
        isOwner: true,
      } as JoinUserHub,
      {
        userId: testUserId,
        hubId: 2,
        user: {},
        hub: {
          name: "hub2"
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
          name: "hub1"
        } as Hub,
      } as JoinUserHub,
      {
        userId: testUserId,
        isOwner: false,
        hub: {
          name: "hub2"
        } as Hub,
      } as JoinUserHub,
    ];
    const hubResults: Hub[] = testResults.map(x => x.hub);
    // notice we are pulling the repo variable and using jest.spyOn with no issues
    jest.spyOn(joinUserHubRepo, 'find').mockResolvedValueOnce(testResults);
    expect(await service.memberOfHubs(testUserId)).toEqual(hubResults);
  });
});
