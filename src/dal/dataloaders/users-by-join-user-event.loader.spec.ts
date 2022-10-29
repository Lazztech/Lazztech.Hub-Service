import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../entity/user.entity';
import { UsersByJoinUserEventLoader } from './users-by-join-user-event.loader';

describe('UsersByJoinUserEventLoader', () => {
  let provider: UsersByJoinUserEventLoader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersByJoinUserEventLoader,
        {
          provide: getRepositoryToken(User),
          useClass: EntityRepository,
        }
      ],
    }).compile();

    provider = await module.resolve<UsersByJoinUserEventLoader>(UsersByJoinUserEventLoader);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
