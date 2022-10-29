import { Test, TestingModule } from '@nestjs/testing';
import { JoinUserHubsByHubLoader } from './join-user-hubs-by-hub.loader';

describe('JoinUserHubsByHubLoader', () => {
  let provider: JoinUserHubsByHubLoader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JoinUserHubsByHubLoader],
    }).compile();

    provider = module.get<JoinUserHubsByHubLoader>(JoinUserHubsByHubLoader);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
