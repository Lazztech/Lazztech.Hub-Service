import { Test, TestingModule } from '@nestjs/testing';
import { HubGeofenceService } from './hub-geofence.service';

describe('HubGeofenceService', () => {
  let service: HubGeofenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HubGeofenceService],
    }).compile();

    service = module.get<HubGeofenceService>(HubGeofenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should resolve for enteredHubGeofence', async () => {
    //TODO
    //easy
    //should return?
  });

  it('should resolve for exitedHubGeofence', async () => {
    //TODO
    //easy
    //should return?
  });
});
