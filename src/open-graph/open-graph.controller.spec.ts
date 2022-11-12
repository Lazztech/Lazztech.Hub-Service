import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Test, TestingModule } from '@nestjs/testing';
import { FileUrlService } from '../file/file-url/file-url.service';
import { Event } from '../dal/entity/event.entity';
import { Hub } from '../dal/entity/hub.entity';
import { OpenGraphController } from './open-graph.controller';
import { OpenGraphService } from './open-graph.service';

describe('OpenGraphController', () => {
  let controller: OpenGraphController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpenGraphController],
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

    controller = module.get<OpenGraphController>(OpenGraphController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
