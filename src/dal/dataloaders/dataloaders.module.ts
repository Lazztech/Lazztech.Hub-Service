import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Hub } from '../entity/hub.entity';
import { JoinUserHub } from '../entity/joinUserHub.entity';
import { HubsByJoinUserHubLoader } from './hubs-by-join-user-hub.loader';

@Module({
    imports: [
        MikroOrmModule.forFeature([JoinUserHub, Hub])
    ],
    providers: [
        HubsByJoinUserHubLoader
    ],
    exports: [
        HubsByJoinUserHubLoader,
    ]
})
export class DataloadersModule {}
