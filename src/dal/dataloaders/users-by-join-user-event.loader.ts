import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { User } from '../entity/user.entity';
@Injectable({ scope: Scope.REQUEST })
export class UsersByJoinUserEventLoader extends DataLoader<number, User> {
    private logger = new Logger(UsersByJoinUserEventLoader.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: EntityRepository<User>,
    ) {
        super(keys => this.batchLoadFn(keys));
    }

    private async batchLoadFn(userIds: readonly number[]): Promise<User[]> {
        this.logger.debug(userIds);
        return this.userRepository.find(userIds as number[]);
    }
}