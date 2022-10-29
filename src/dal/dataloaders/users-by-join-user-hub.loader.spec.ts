import { Test, TestingModule } from '@nestjs/testing';
import { UsersByJoinUserHubLoader } from './users-by-join-user-hub.loader';

describe('UsersByJoinUserHubLoader', () => {
  let provider: UsersByJoinUserHubLoader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersByJoinUserHubLoader],
    }).compile();

    provider = module.get<UsersByJoinUserHubLoader>(UsersByJoinUserHubLoader);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
