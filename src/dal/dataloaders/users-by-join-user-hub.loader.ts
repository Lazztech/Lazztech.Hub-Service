import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { User } from '../entity/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UsersByJoinUserHubLoader extends DataLoader<number, User> {
    private logger = new Logger(UsersByJoinUserHubLoader.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: EntityRepository<User>
    ) {
        super(keys => this.batchLoadFn(keys));
    }

    private async batchLoadFn(userIds: readonly number[]): Promise<User[]> {
        this.logger.debug(userIds);
        const users = await this.userRepository.find(userIds as number[]);
        const map: { [key: string]: User } = {};
        users.forEach(user => {
            map[user.id] = user;
        });
        return userIds.map(key => map[key]);
    }
}
