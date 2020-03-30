import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JoinUserHub } from 'src/dal/entity/joinUserHub.entity';
import { Repository } from 'typeorm';
import { Hub } from 'src/dal/entity/hub.entity';
import { User } from 'src/dal/entity/user.entity';
import { ConfigService } from '@nestjs/config';

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<JoinUserHub>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        ConfigService,
        {
          provide: getRepositoryToken(JoinUserHub),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    // Save the instance of the repository and set the correct generics
    repo = module.get<Repository<JoinUserHub>>(getRepositoryToken(JoinUserHub));
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
    jest.spyOn(repo, 'find').mockResolvedValueOnce(testResults);
    expect(await service.getUsersOwnedHubs(testUserId)).toEqual(hubResults);
  });

  it(`should return for memberOfHubs`, async () => {
    // mock file for reuse
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
    jest.spyOn(repo, 'find').mockResolvedValueOnce(testResults);
    expect(await service.memberOfHubs(testUserId)).toEqual(hubResults);
  });
});
