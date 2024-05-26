import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { InAppNotification } from '../dal/entity/inAppNotification.entity';
import { Invite } from '../dal/entity/invite.entity';
import { UserDevice } from '../dal/entity/userDevice.entity';
import { FILE_SERVICE } from '../file/file-service.token';
import { ImageFileService } from '../file/image-file/image-file.service';
import { LocalFileService } from '../file/local-file/local-file.service';
import { HubService } from '../hub/hub.service';
import { NotificationService } from '../notification/notification.service';
import { Hub } from '../dal/entity/hub.entity';
import { JoinUserHub } from '../dal/entity/joinUserHub.entity';
import { User } from '../dal/entity/user.entity';
import { ModerationResolver } from './moderation.resolver';
import { ModerationService } from './moderation.service';
import { Event } from '../dal/entity/event.entity';
import { JoinUserEvent } from '../dal/entity/joinUserEvent.entity';
import { File } from '../dal/entity/file.entity';
import { JoinHubFile } from '../dal/entity/joinHubFile.entity';
import { Block } from '../dal/entity/block.entity';

describe('ModerationResolver', () => {
  let resolver: ModerationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.local', '.env'],
          isGlobal: true,
        }),
        HttpModule,
      ],
      providers: [
        ModerationResolver,
        ModerationService,
        HubService,
        NotificationService,
        ImageFileService,
        {
          provide: FILE_SERVICE,
          useClass: LocalFileService,
        },
        NotificationService,
        {
          provide: getRepositoryToken(User),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(Hub),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(JoinUserHub),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(InAppNotification),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(UserDevice),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(Invite),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(Block),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(Event),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(JoinUserEvent),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(File),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(JoinHubFile),
          useClass: EntityRepository,
        },
      ],
    }).compile();

    resolver = module.get<ModerationResolver>(ModerationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
