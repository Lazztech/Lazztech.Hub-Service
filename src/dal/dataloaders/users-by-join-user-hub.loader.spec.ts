import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../entity/user.entity';
import { UsersByJoinUserHubLoader } from './users-by-join-user-hub.loader';

describe('UsersByJoinUserHubLoader', () => {
  let provider: UsersByJoinUserHubLoader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersByJoinUserHubLoader,
        {
          provide: getRepositoryToken(User),
          useClass: EntityRepository,
        }
      ],
    }).compile();

    provider = await module.resolve<UsersByJoinUserHubLoader>(UsersByJoinUserHubLoader);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
