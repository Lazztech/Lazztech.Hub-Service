import { Test, TestingModule } from '@nestjs/testing';
import { EventGeofenceService } from './event-geofence.service';

describe('EventGeofenceService', () => {
  let service: EventGeofenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventGeofenceService],
    }).compile();

    service = module.get<EventGeofenceService>(EventGeofenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
