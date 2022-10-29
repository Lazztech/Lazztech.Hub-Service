import { Test, TestingModule } from '@nestjs/testing';
import { UsersByJoinUserEventLoader } from './users-by-join-user-event.loader';

describe('UsersByJoinUserEventLoader', () => {
  let provider: UsersByJoinUserEventLoader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersByJoinUserEventLoader],
    }).compile();

    provider = module.get<UsersByJoinUserEventLoader>(UsersByJoinUserEventLoader);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
