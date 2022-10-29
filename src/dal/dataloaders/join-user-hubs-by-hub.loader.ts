import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger, Scope } from '@nestjs/common';
import { JoinUserHub } from '../entity/joinUserHub.entity';
import DataLoader from 'dataloader';
import { Hub } from '../entity/hub.entity';

@Injectable({ scope: Scope.REQUEST })
export class JoinUserHubsByHubLoader extends DataLoader<number, JoinUserHub[]> {
    private logger = new Logger(JoinUserHubsByHubLoader.name);

    constructor(
        @InjectRepository(Hub)
        private readonly hubRepository: EntityRepository<Hub>,
    ) {
        super(keys => this.batchLoadFn(keys));
    }

    private async batchLoadFn(hubIds: readonly number[]): Promise<JoinUserHub[][]> {
        this.logger.debug(hubIds);
        const hubs = await this.hubRepository.find({
            id: { $in: hubIds as number[] }
        }, {
            fields: ['id'],
            populate: ['usersConnection']
        });
        return Promise.all(
            hubs?.map(hub => hub.usersConnection.loadItems())
        );
    }
}
