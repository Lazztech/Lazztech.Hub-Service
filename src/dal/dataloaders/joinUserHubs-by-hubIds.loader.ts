import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger, Scope } from '@nestjs/common';
import { JoinUserHub } from '../entity/joinUserHub.entity';
import DataLoader from 'dataloader';

@Injectable({ scope: Scope.REQUEST })
export class JoinUserHubsByHubIdsLoader extends DataLoader<number, JoinUserHub[]> {
    private logger = new Logger(JoinUserHubsByHubIdsLoader.name);

    constructor(
        @InjectRepository(JoinUserHub)
        private readonly joinUserHub: EntityRepository<JoinUserHub>,
    ) {
        super(keys => this.batchLoadFn(keys));
    }

    private async batchLoadFn(hubIds: readonly number[]): Promise<JoinUserHub[][]> {
        this.logger.debug(hubIds);
        const joins = await this.joinUserHub.find({
            hub: { $in: hubIds as number[] }
        });
        const map: { [key: string]: Array<JoinUserHub> } = {};
        joins.forEach(join => {
            if (!map[join.hub.id]?.length) {
                map[join.hub.id] = [];
            }
            map[join.hub.id].push(join);
        });
        const results = hubIds.map(key => map[key]);
        return results;
    }
}
