import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Hub } from '../entity/hub.entity';
import { JoinUserHub } from '../entity/joinUserHub.entity';

@Injectable({ scope: Scope.REQUEST })
export class HubsByJoinUserHubLoader extends DataLoader<number, Hub> {
    private logger = new Logger(HubsByJoinUserHubLoader.name);

    constructor(
        @InjectRepository(Hub)
        private readonly hubRepository: EntityRepository<Hub>,
        @InjectRepository(JoinUserHub)
        private readonly joinUserHubRepository: EntityRepository<JoinUserHub>,
    ) {
        super(keys => this.batchLoadFn(keys));
    }

   private async batchLoadFn(hubIds: readonly number[]): Promise<Hub[]> {
        this.logger.debug(hubIds);
        return this.hubRepository.find(hubIds as number[]);
    }
}
