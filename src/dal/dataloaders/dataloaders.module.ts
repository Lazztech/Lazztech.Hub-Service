import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Hub } from '../entity/hub.entity';
import { JoinUserHub } from '../entity/joinUserHub.entity';
import { User } from '../entity/user.entity';
import { HubsByHubIdLoader } from './hubs-by-hubId.loader';
import { UsersByUserIdLoader } from './users-by-userId.loader';
import { JoinUserHubsByHubIdsLoader } from './joinUserHubs-by-hubIds.loader';
import { Block } from '../entity/block.entity';
import { EventByEventIdsLoader } from './events-by-eventIds.loader';
import { Event } from '../entity/event.entity';
import { BlocksByCompositKeyLoader } from './blocks-by-compositKey.loader';
import { BlocksByUserLoader } from './blocks-by-user.loader';

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
        JoinUserHubsByHubIdsLoader,
        EventByEventIdsLoader,
        BlocksByCompositKeyLoader,
        BlocksByUserLoader,
    ],
    exports: [
        HubsByHubIdLoader,
        UsersByUserIdLoader,
        JoinUserHubsByHubIdsLoader,
        EventByEventIdsLoader,
        BlocksByCompositKeyLoader,
        BlocksByUserLoader,
    ]
})
export class DataloadersModule {}
