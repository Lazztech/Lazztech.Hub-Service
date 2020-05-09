import { Injectable } from '@angular/core';
import { SwUpdate, UpdateAvailableEvent } from '@angular/service-worker';
import { Observable } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  updateAvailable: Observable<UpdateAvailableEvent>;

  constructor(
    public swUpdate: SwUpdate,
    private logger: NGXLogger
    ) { 
      if (this.swUpdate.isEnabled) {
        this.updateAvailable = this.swUpdate.available;
        this.swUpdate.available.subscribe(() => {
            if(confirm("New version available. Load New Version?")) {
                window.location.reload();
            }
        });
      } else {
        this.logger.log('swUpdate not enabled.');
      }
    }

  checkForUpdate() {
    this.logger.log("checking if sw is enabled.")
      if (this.swUpdate.isEnabled) {
        this.swUpdate.checkForUpdate().then(() => {
          this.logger.log("Checking for updates...");
        }).catch((error) => {
          this.logger.log("Error when checking for update", error);
      });
    } else {
      this.logger.log('swUpdate not enabled.');
    }
  }

  updateToLatest(): void {
    this.logger.log('Update to latest version?');
    if(confirm("New version available. Load New Version?")) {
      // window.location.reload();
      this.swUpdate.activateUpdate().then(() => document.location.reload());
    }
  }
}
