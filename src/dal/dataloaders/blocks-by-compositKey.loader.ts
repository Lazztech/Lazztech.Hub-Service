import { Injectable, Logger, Scope } from '@nestjs/common';
import { Block } from '../entity/block.entity';
import DataLoader from 'dataloader';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import _ from 'lodash';

@Injectable({ scope: Scope.REQUEST })
export class BlocksByCompositKeyLoader extends DataLoader<{ to: number, from: number }, Block | undefined> {
    private logger = new Logger(BlocksByCompositKeyLoader.name);

    constructor(
        @InjectRepository(Block)
        private readonly blockRepository: EntityRepository<Block>
    ) {
        super(keys => this.batchLoadFn(keys));
    }

    private async batchLoadFn(keys: readonly { to: number, from: number }[]): Promise<Block[]> {
        this.logger.debug(this.batchLoadFn.name);
        // idk why but the repo.find method changes this value from an arry of objects to a two dimensional array?
        // so it must be cloned so we don't loos the original key representation
        const blocks = await this.blockRepository.find(_.clone(keys) as { to: number, from: number }[]);

        const results = keys?.map(key => blocks.find(block => {
            const found = block.from.id == key.from && block.to.id == key.to;
            return found;
        }));
        return results;
    }
}
