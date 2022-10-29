import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { Event } from '../entity/event.entity';
import { EventsByJoinUserEventLoader } from './events-by-join-user-event.loader';

describe('EventsByJoinUserEventLoader', () => {
  let provider: EventsByJoinUserEventLoader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsByJoinUserEventLoader,
        {
          provide: getRepositoryToken(Event),
          useClass: EntityRepository,
        }
      ],
    }).compile();

    provider = module.get<EventsByJoinUserEventLoader>(EventsByJoinUserEventLoader);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
