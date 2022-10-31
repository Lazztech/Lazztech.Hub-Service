import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Test, TestingModule } from '@nestjs/testing';
import { Hub } from '../entity/hub.entity';
import { HubsByHubIdLoader } from './hubs-by-hubId.loader';

describe('HubsByJoinUserHubLoader', () => {
  let provider: HubsByHubIdLoader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HubsByHubIdLoader,
        {
          provide: getRepositoryToken(Hub),
          useClass: EntityRepository,
        }
      ],
    }).compile();

    provider = await module.resolve<HubsByHubIdLoader>(HubsByHubIdLoader);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
