import { Test, TestingModule } from '@nestjs/testing';
import { HubMicroChatService } from './hub-micro-chat.service';

describe('HubMicroChatService', () => {
  let service: HubMicroChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HubMicroChatService],
    }).compile();

    service = module.get<HubMicroChatService>(HubMicroChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should resolve for microChatToHub', async () => {
    //TODO
  });

  it('should return for createMicroChat', async () => {
    //TODO
  });

  it('should resolve for deleteMicroChat', async () => {
    //TODO
  });
});
