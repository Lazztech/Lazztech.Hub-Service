import { Test, TestingModule } from '@nestjs/testing';
import { BlockedByUserLoader } from './blocked-by-user.loader';

describe('BlockedByUserLoader', () => {
  let provider: BlockedByUserLoader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockedByUserLoader],
    }).compile();

    provider = module.get<BlockedByUserLoader>(BlockedByUserLoader);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
