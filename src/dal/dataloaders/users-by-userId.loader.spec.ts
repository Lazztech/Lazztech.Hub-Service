import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../entity/user.entity';
import { UsersByUserIdLoader } from './users-by-userId.loader';

describe('UsersByJoinUserHubLoader', () => {
  let provider: UsersByUserIdLoader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersByUserIdLoader,
        {
          provide: getRepositoryToken(User),
          useClass: EntityRepository,
        }
      ],
    }).compile();

    provider = await module.resolve<UsersByUserIdLoader>(UsersByUserIdLoader);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
