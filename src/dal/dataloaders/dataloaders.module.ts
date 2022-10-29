import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Hub } from '../entity/hub.entity';
import { JoinUserHub } from '../entity/joinUserHub.entity';
import { User } from '../entity/user.entity';
import { HubsByJoinUserHubLoader } from './hubs-by-join-user-hub.loader';
import { UsersByJoinUserHubLoader } from './users-by-join-user-hub.loader';
import { JoinUserHubsByHubLoader } from './join-user-hubs-by-hub.loader';
import { BlocksByUserLoader } from './blocks-by-user.loader';
import { Block } from '../entity/block.entity';

@Module({
    imports: [
        MikroOrmModule.forFeature([
            JoinUserHub,
            Hub,
            User,
            Block,
        ]),
    ],
    providers: [
        HubsByJoinUserHubLoader,
        UsersByJoinUserHubLoader,
        JoinUserHubsByHubLoader,
        BlocksByUserLoader,
    ],
    exports: [
        HubsByJoinUserHubLoader,
        UsersByJoinUserHubLoader,
        JoinUserHubsByHubLoader,
        BlocksByUserLoader,
    ]
})
export class DataloadersModule {}
