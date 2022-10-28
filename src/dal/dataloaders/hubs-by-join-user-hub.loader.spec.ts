import { Test, TestingModule } from '@nestjs/testing';
import { HubsByJoinUserHubLoader } from './hubs-by-join-user-hub.loader';

describe('HubsByJoinUserHubLoader', () => {
  let provider: HubsByJoinUserHubLoader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HubsByJoinUserHubLoader],
    }).compile();

    provider = module.get<HubsByJoinUserHubLoader>(HubsByJoinUserHubLoader);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
