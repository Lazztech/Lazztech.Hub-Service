import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Hub } from '../entity/hub.entity';
import { JoinUserHub } from '../entity/joinUserHub.entity';
import { User } from '../entity/user.entity';
import { HubsByJoinUserHubLoader } from './hubs-by-join-user-hub.loader';
import { UsersByJoinUserHubLoader } from './users-by-join-user-hub.loader';
import { JoinUserHubsByHubLoader } from './join-user-hubs-by-hub.loader';

@Module({
    imports: [
        MikroOrmModule.forFeature([
            JoinUserHub,
            Hub,
            User,
        ]),
    ],
    providers: [
        HubsByJoinUserHubLoader,
        UsersByJoinUserHubLoader,
        JoinUserHubsByHubLoader,
    ],
    exports: [
        HubsByJoinUserHubLoader,
        UsersByJoinUserHubLoader,
        JoinUserHubsByHubLoader,
    ]
})
export class DataloadersModule {}
