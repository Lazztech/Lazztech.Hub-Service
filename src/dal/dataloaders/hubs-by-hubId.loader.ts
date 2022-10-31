import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Hub } from '../entity/hub.entity';

@Injectable({ scope: Scope.REQUEST })
export class HubsByHubIdLoader extends DataLoader<number, Hub> {
    private logger = new Logger(HubsByHubIdLoader.name);

    constructor(
        @InjectRepository(Hub)
        private readonly hubRepository: EntityRepository<Hub>,
    ) {
        super(keys => this.batchLoadFn(keys));
    }

   private async batchLoadFn(hubIds: readonly number[]): Promise<Hub[]> {
        this.logger.debug(hubIds);
        const hubs = await this.hubRepository.find(hubIds as number[]);
        const map: { [hubId: string]: Hub } = {};
        hubs.forEach(hub => {
            map[hub.id] = hub
        });
        return hubIds.map(key => map[key]);
    }
}
