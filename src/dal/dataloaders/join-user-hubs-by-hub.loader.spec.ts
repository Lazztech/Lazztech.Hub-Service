import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Test, TestingModule } from '@nestjs/testing';
import { Hub } from '../entity/hub.entity';
import { JoinUserHubsByHubLoader } from './join-user-hubs-by-hub.loader';

describe('JoinUserHubsByHubLoader', () => {
  let provider: JoinUserHubsByHubLoader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JoinUserHubsByHubLoader,
        {
          provide: getRepositoryToken(Hub),
          useClass: EntityRepository,
        }
      ],
    }).compile();

    provider = module.get<JoinUserHubsByHubLoader>(JoinUserHubsByHubLoader);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
