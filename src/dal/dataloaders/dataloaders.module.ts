import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Hub } from '../entity/hub.entity';
import { JoinUserHub } from '../entity/joinUserHub.entity';
import { User } from '../entity/user.entity';
import { HubsByHubIdLoader } from './hubs-by-hubId.loader';
import { UsersByUserIdLoader } from './users-by-userId.loader';
import { JoinUserHubsByHubLoader } from './join-user-hubs-by-hub.loader';
import { BlocksByUserLoader } from './blocks-by-user.loader';
import { Block } from '../entity/block.entity';
import { EventsByJoinUserEventLoader } from './events-by-join-user-event.loader';
import { Event } from '../entity/event.entity';
import { BlockedByUserLoader } from './blocked-by-user.loader';

@Module({
    imports: [
        MikroOrmModule.forFeature([
            JoinUserHub,
            Hub,
            User,
            Block,
            Event,
        ]),
    ],
    providers: [
        HubsByHubIdLoader,
        UsersByUserIdLoader,
        JoinUserHubsByHubLoader,
        BlocksByUserLoader,
        EventsByJoinUserEventLoader,
        BlockedByUserLoader,
    ],
    exports: [
        HubsByHubIdLoader,
        UsersByUserIdLoader,
        JoinUserHubsByHubLoader,
        BlocksByUserLoader,
        EventsByJoinUserEventLoader,
        BlockedByUserLoader,
    ]
})
export class DataloadersModule {}
