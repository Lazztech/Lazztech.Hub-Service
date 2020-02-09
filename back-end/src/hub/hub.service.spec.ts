import { Test, TestingModule } from '@nestjs/testing';
import { HubService } from './hub.service';

describe('HubService', () => {
  let service: HubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HubService],
    }).compile();

    service = module.get<HubService>(HubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
