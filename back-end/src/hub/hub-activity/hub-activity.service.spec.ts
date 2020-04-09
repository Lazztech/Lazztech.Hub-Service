import { Test, TestingModule } from '@nestjs/testing';
import { HubActivityService } from './hub-activity.service';

describe('HubActivityService', () => {
  let service: HubActivityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HubActivityService],
    }).compile();

    service = module.get<HubActivityService>(HubActivityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return for activateHub', async () => {
    //TODO
  });

  it('should return for deactivateHub', async () => {
    //TODO
  });
});
