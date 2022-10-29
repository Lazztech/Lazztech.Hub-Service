import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Hub } from '../entity/hub.entity';
import { JoinUserHub } from '../entity/joinUserHub.entity';
import { User } from '../entity/user.entity';
import { HubsByJoinUserHubLoader } from './hubs-by-join-user-hub.loader';
import { UsersByJoinUserHubLoader } from './users-by-join-user-hub.loader';

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
    ],
    exports: [
        HubsByJoinUserHubLoader,
        UsersByJoinUserHubLoader,
    ]
})
export class DataloadersModule {}
