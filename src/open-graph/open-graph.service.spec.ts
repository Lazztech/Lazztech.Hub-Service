import { Test, TestingModule } from '@nestjs/testing';
import { OpenGraphService } from './open-graph.service';

describe('OpenGraphService', () => {
  let service: OpenGraphService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenGraphService],
    }).compile();

    service = module.get<OpenGraphService>(OpenGraphService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
