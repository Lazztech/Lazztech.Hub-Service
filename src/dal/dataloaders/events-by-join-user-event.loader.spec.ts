import { Test, TestingModule } from '@nestjs/testing';
import { EventsByJoinUserEventLoader } from './events-by-join-user-event.loader';

describe('EventsByJoinUserEventLoader', () => {
  let provider: EventsByJoinUserEventLoader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsByJoinUserEventLoader],
    }).compile();

    provider = module.get<EventsByJoinUserEventLoader>(EventsByJoinUserEventLoader);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
