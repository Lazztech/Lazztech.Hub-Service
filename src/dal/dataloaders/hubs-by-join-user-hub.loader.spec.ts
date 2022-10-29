import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Test, TestingModule } from '@nestjs/testing';
import { Hub } from '../entity/hub.entity';
import { HubsByJoinUserHubLoader } from './hubs-by-join-user-hub.loader';

describe('HubsByJoinUserHubLoader', () => {
  let provider: HubsByJoinUserHubLoader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HubsByJoinUserHubLoader,
        {
          provide: getRepositoryToken(Hub),
          useClass: EntityRepository,
        }
      ],
    }).compile();

    provider = module.get<HubsByJoinUserHubLoader>(HubsByJoinUserHubLoader);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
