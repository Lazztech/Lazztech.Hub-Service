import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Test, TestingModule } from '@nestjs/testing';
import { JoinUserHub } from '../entity/joinUserHub.entity';
import { JoinUserHubsByHubIdsLoader } from './joinUserHubs-by-hubIds.loader';

describe('JoinUserHubsByHubLoader', () => {
  let provider: JoinUserHubsByHubIdsLoader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JoinUserHubsByHubIdsLoader,
        {
          provide: getRepositoryToken(JoinUserHub),
          useClass: EntityRepository,
        }
      ],
    }).compile();

    provider = await module.resolve<JoinUserHubsByHubIdsLoader>(JoinUserHubsByHubIdsLoader);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
