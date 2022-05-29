import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Test, TestingModule } from '@nestjs/testing';
import { FILE_SERVICE } from '../file/file-service.token';
import { LocalFileService } from '../file/local-file/local-file.service';
import { Event } from '../dal/entity/event.entity';
import { JoinUserEvent } from '../dal/entity/joinUserEvent.entity';
import { EventService } from './event.service';
import { ConfigModule } from '@nestjs/config';
import { ImageFileService } from '../file/image-file/image-file.service';

describe('EventService', () => {
  let service: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.local', '.env'],
          isGlobal: true,
        }),
      ],
      providers: [
        EventService,
        ImageFileService,
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
      ],
    }).compile();

    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
