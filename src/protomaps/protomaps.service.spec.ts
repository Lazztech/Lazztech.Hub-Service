import { Test, TestingModule } from '@nestjs/testing';
import { ProtomapsService } from './protomaps.service';

describe('ProtomapsService', () => {
  let service: ProtomapsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProtomapsService],
    }).compile();

    service = module.get<ProtomapsService>(ProtomapsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
