import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { FileUrlService } from '../file/file-url/file-url.service';
import { Event } from '../dal/entity/event.entity';
import { Hub } from '../dal/entity/hub.entity';
import { OpenGraphService } from './open-graph.service';

describe('OpenGraphService', () => {
  let service: OpenGraphService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenGraphService,
        FileUrlService,
        {
          provide: getRepositoryToken(Hub),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(Event),
          useClass: EntityRepository,
        },
      ],
    }).compile();

    service = module.get<OpenGraphService>(OpenGraphService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
