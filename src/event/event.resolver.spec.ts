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

describe('EventResolver', () => {
  let resolver: EventResolver;

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
        EventResolver,
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

    resolver = module.get<EventResolver>(EventResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
