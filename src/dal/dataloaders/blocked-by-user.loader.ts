import { Injectable, Logger, Scope } from '@nestjs/common';
import { Block } from '../entity/block.entity';
import DataLoader from 'dataloader';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';

@Injectable({ scope: Scope.REQUEST })
export class BlockedByUserLoader extends DataLoader<{ to: number, from: number }, Block[]> {
    private logger = new Logger(BlockedByUserLoader.name);

    constructor(
        @InjectRepository(Block)
        private readonly blockRepository: EntityRepository<Block>
    ) {
        super(keys => this.batchLoadFn(keys));
    }

    private async batchLoadFn(keys: readonly { to: number, from: number }[]): Promise<Block[][]> {
        this.logger.debug(this.batchLoadFn.name);
        const blocks = await this.blockRepository.find(keys as { to: number, from: number }[]);
        return keys?.map(key => blocks?.filter(block => block.to.id == key.to && block.from.id == key.from));
    }
}
