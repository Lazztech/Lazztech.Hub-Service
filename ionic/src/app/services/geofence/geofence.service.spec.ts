import { TestBed } from '@angular/core/testing';

import { GeofenceService } from './geofence.service';

describe('GeofenceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeofenceService = TestBed.get(GeofenceService);
    expect(service).toBeTruthy();
  });
});
