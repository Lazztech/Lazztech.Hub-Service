import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Test, TestingModule } from '@nestjs/testing';
import { JoinUserEvent } from '../../dal/entity/joinUserEvent.entity';
import { EventGeofenceService } from './event-geofence.service';

describe('EventGeofenceService', () => {
  let service: EventGeofenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventGeofenceService,
        {
          provide: getRepositoryToken(JoinUserEvent),
          useClass: EntityRepository,
        },
      ],
    }).compile();

    service = module.get<EventGeofenceService>(EventGeofenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
