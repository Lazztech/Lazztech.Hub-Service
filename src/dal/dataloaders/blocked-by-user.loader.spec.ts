import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { Block } from '../entity/block.entity';
import { BlockedByUserLoader } from './blocked-by-user.loader';

describe('BlockedByUserLoader', () => {
  let provider: BlockedByUserLoader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlockedByUserLoader,
        {
          provide: getRepositoryToken(Block),
          useClass: EntityRepository,
        },
      ],
    }).compile();

    provider = module.get<BlockedByUserLoader>(BlockedByUserLoader);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
