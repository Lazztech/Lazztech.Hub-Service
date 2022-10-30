import { Injectable, Logger, Scope } from '@nestjs/common';
import { Block } from '../entity/block.entity';
import DataLoader from 'dataloader';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

@Injectable({ scope: Scope.REQUEST })
export class BlockedByUserLoader extends DataLoader<{ to: number, from: number }, Block> {
    private logger = new Logger(BlockedByUserLoader.name);

    constructor(
        @InjectRepository(Block)
        private readonly blockRepository: EntityRepository<Block>
    ) {
        super(keys => this.batchLoadFn(keys));
    }

    private async batchLoadFn(keys: readonly { to: number, from: number }[]): Promise<Block[]> {
        this.logger.debug(this.batchLoadFn.name);
        const blocks = await this.blockRepository.find(keys as { to: number, from: number }[]);
        const map = new Map<{ to: number, from: number }, Block>();
        blocks.forEach(block => {
            map.set({ to: block.to.id, from: block.from.id }, block)
        });
        
        return keys.map(key => map.get(key));
    }
}
