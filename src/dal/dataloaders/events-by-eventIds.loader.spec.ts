import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { Event } from '../entity/event.entity';
import { EventByEventIdsLoader } from './events-by-eventIds.loader';

describe('EventsByJoinUserEventLoader', () => {
  let provider: EventByEventIdsLoader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventByEventIdsLoader,
        {
          provide: getRepositoryToken(Event),
          useClass: EntityRepository,
        }
      ],
    }).compile();

    provider = await module.resolve<EventByEventIdsLoader>(EventByEventIdsLoader);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
