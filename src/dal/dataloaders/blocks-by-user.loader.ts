import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Block } from '../entity/block.entity';

@Injectable({ scope: Scope.REQUEST })
export class BlocksByUserLoader extends DataLoader<number, Block[]> {
    private logger = new Logger(BlocksByUserLoader.name);

    constructor(
        @InjectRepository(Block)
        private readonly blockRepository: EntityRepository<Block>
    ) {
        super(keys => this.batchLoadFn(keys));
    }

    private async batchLoadFn(keys: readonly number[]): Promise<Block[][]> {
        this.logger.debug(keys);
        const blocks = await this.blockRepository.find({
            from: { $in: keys as number[] }
        });
        const map: { [key: number]: Block[] } = {};
        blocks.forEach(block => {
            if (!map[block.from.id]?.length) {
                map[block.from.id] = [];
            }
            map[block.from.id]?.push(block);
        });
        return keys.map(key => map[key]);
    }
}
