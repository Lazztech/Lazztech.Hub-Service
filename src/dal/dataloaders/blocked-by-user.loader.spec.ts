import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { Block } from '../entity/block.entity';
import { BlockedByUserLoader } from './blocked-by-user.loader';

describe('BlockedByUserLoader', () => {
  let provider: BlockedByUserLoader;
  let blockRepository: EntityRepository<Block>;

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

    provider = await module.resolve<BlockedByUserLoader>(BlockedByUserLoader);
    blockRepository = module.get<EntityRepository<Block>>(
      getRepositoryToken(Block)
    );
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should fucking work', async () => {
    // arrange
    const mocks = [];
    jest.spyOn(blockRepository, 'find')
      .mockResolvedValueOnce(mocks as any);

    // act
    const blocked = await provider.load({ to: 12, from: 1 });

    // assert
    expect(blocked).toBeFalsy();
  });

  it('should fucking be blocked', async () => {
    // arrange
    const mockBlock = { 
      to: { id: 12 }, 
      from: { id: 1 }, 
    };
    const mocks = [
      mockBlock
    ];
    jest.spyOn(blockRepository, 'find')
      .mockResolvedValueOnce(mocks as any);

    // act
    const blocked = await provider.load({ to: 12, from: 1 });

    // assert
    expect(blocked).toBeTruthy();
  });
});
