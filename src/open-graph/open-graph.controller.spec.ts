import { Test, TestingModule } from '@nestjs/testing';
import { OpenGraphController } from './open-graph.controller';
import { OpenGraphService } from './open-graph.service';

describe('OpenGraphController', () => {
  let controller: OpenGraphController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpenGraphController],
      providers: [OpenGraphService],
    }).compile();

    controller = module.get<OpenGraphController>(OpenGraphController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
