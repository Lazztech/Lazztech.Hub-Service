import { TestBed } from '@angular/core/testing';

import { PwaInstallService } from './pwa-install.service';

describe('PwaInstallService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PwaInstallService = TestBed.get(PwaInstallService);
    expect(service).toBeTruthy();
  });
});
