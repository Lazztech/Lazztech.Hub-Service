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
  let userRepo: Repository<User>;
  let joinUserHubRepo: Repository<JoinUserHub>;
  let configService: ConfigService;

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
    joinUserHubRepo = module.get<Repository<JoinUserHub>>(getRepositoryToken(JoinUserHub));
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    configService = module.get(ConfigService);
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

  it(`should return accessToken for login`, async () => {
    //Arrange
    const password = "Password123";
    const email = "gianlazzarini@gmail.com";
    const testUser = {
      id: 1,
      email,
      password: "$2a$12$kYPNrlyLr7z4D.V3dEHFn.kQD2nRC0x7fINzPgfoSW4D4GQhyeGTO",
    } as User;
    const accessTokenSecret = "***REMOVED***";
    const accessTokenResult = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTU4NTc5MjQxM30.EXe0IY-Q5dGFCyO5vgDIgeaTGqTqOO66MspE5pS-yd0";
    jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(testUser);
    jest.spyOn(configService, 'get').mockReturnValueOnce(accessTokenSecret);

    //Act
    const result = await service.login(password, email);

    //Assert
    expect(result).toEqual(accessTokenResult);
  });
});
