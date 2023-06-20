import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ImageFileService } from '../file/image-file/image-file.service';
import { Event } from '../dal/entity/event.entity';
import { JoinUserEvent } from '../dal/entity/joinUserEvent.entity';
import { FILE_SERVICE } from '../file/file-service.token';
import { LocalFileService } from '../file/local-file/local-file.service';
import { EventResolver } from './event.resolver';
import { EventService } from './event.service';
import { User } from '../dal/entity/user.entity';
import { NotificationService } from '../notification/notification.service';
import { HttpModule } from '@nestjs/axios';
import { InAppNotification } from '../dal/entity/inAppNotification.entity';
import { UserDevice } from '../dal/entity/userDevice.entity';
import { File } from '../dal/entity/file.entity';
import { EventGeofenceService } from './event-geofence/event-geofence.service';
import { JoinEventFile } from '../dal/entity/joinEventFile.entity';

describe('EventResolver', () => {
  let resolver: EventResolver;

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
        EventGeofenceService,
        EventService,
        EventResolver,
        ImageFileService,
        NotificationService,
        {
          provide: FILE_SERVICE,
          useClass: LocalFileService,
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
          provide: getRepositoryToken(User),
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
          provide: getRepositoryToken(File),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(JoinEventFile),
          useClass: EntityRepository,
        },
      ],
    }).compile();

    resolver = module.get<EventResolver>(EventResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
