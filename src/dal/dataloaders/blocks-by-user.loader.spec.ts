import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { Block } from '../entity/block.entity';
import { BlocksByUserLoader } from './blocks-by-user.loader';

describe('BlocksByUserLoader', () => {
  let provider: BlocksByUserLoader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlocksByUserLoader,
        {
          provide: getRepositoryToken(Block),
          useClass: EntityRepository,
        }
      ],
    }).compile();

    provider = await module.resolve<BlocksByUserLoader>(BlocksByUserLoader);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
