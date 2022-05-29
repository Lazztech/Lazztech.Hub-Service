import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { HubService } from '../hub/hub.service';
import { Hub } from '../dal/entity/hub.entity';
import { JoinUserHub } from '../dal/entity/joinUserHub.entity';
import { User } from '../dal/entity/user.entity';
import { ModerationService } from './moderation.service';
import { ConfigModule } from '@nestjs/config';
import { NotificationService } from '../notification/notification.service';
import { ImageFileService } from '../file/image-file/image-file.service';
import { FILE_SERVICE } from '../file/file-service.token';
import { LocalFileService } from '../file/local-file/local-file.service';
import { InAppNotification } from '../dal/entity/inAppNotification.entity';
import { UserDevice } from '../dal/entity/userDevice.entity';
import { Invite } from '../dal/entity/invite.entity';
import { HttpModule } from '@nestjs/common';
import { Block } from '../dal/entity/block.entity';
import { Event } from '../dal/entity/event.entity';
import { JoinUserEvent } from '../dal/entity/joinUserEvent.entity';

describe('ModerationService', () => {
  let service: ModerationService;

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
      ],
    }).compile();

    service = module.get<ModerationService>(ModerationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
