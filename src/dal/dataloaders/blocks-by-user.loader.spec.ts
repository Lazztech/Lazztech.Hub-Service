import { Test, TestingModule } from '@nestjs/testing';
import { BlocksByUserLoader } from './blocks-by-user.loader';

describe('BlocksByUserLoader', () => {
  let provider: BlocksByUserLoader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlocksByUserLoader],
    }).compile();

    provider = module.get<BlocksByUserLoader>(BlocksByUserLoader);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
