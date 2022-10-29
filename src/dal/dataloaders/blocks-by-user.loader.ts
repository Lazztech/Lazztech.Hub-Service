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
        private readonly blockRepository: EntityRepository<Block>,
    ) {
        super(keys => this.batchLoadFn(keys));
    }

    private async batchLoadFn(userIds: readonly number[]): Promise<Block[][]> {
        const blocks = await this.blockRepository.find({
            to: { $in: userIds as number[] }
        }, {
            populate: ['from']
        });
        this.logger.debug(userIds);
        return userIds?.map(userId => blocks?.filter(x => x.from.id == userId));
    }
}
