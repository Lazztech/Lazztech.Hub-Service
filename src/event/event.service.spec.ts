import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Test, TestingModule } from '@nestjs/testing';
import { LocalFileService } from '../file/local-file/local-file.service';
import { Event } from '../dal/entity/event.entity';
import { JoinUserEvent } from '../dal/entity/joinUserEvent.entity';
import { EventService } from './event.service';
import { ConfigModule } from '@nestjs/config';
import { ImageFileService } from '../file/image-file/image-file.service';
import { User } from '../dal/entity/user.entity';
import { HttpModule } from '@nestjs/axios';
import { InAppNotification } from '../dal/entity/inAppNotification.entity';
import { NotificationService } from '../notification/notification.service';
import { UserDevice } from '../dal/entity/userDevice.entity';
import { File } from '../dal/entity/file.entity';
import { JoinEventFile } from '../dal/entity/joinEventFile.entity';
import { EntityManager } from '@mikro-orm/core';
import { FileService } from '../file/file-service.abstract';

describe('EventService', () => {
  let service: EventService;

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
        EventService,
        ImageFileService,
        NotificationService,
        {
          provide: FileService,
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
        {
          provide: EntityManager,
          useValue: {
            persist: jest.fn().mockReturnThis(),
            remove: jest.fn().mockReturnThis(),
            flush: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
