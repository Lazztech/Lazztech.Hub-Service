import { Test, TestingModule } from '@nestjs/testing';
import { HubTasksService } from './hub-tasks.service';

describe('HubTasksService', () => {
  let service: HubTasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HubTasksService],
    }).compile();

    service = module.get<HubTasksService>(HubTasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
