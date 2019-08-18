import { Injectable } from '@angular/core';
import { SwUpdate, UpdateAvailableEvent } from '@angular/service-worker';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  updateAvailable: Observable<UpdateAvailableEvent>;

  constructor(
    public swUpdate: SwUpdate
    ) { 
      if (this.swUpdate.isEnabled) {
        this.updateAvailable = this.swUpdate.available;
        this.swUpdate.available.subscribe(() => {
            if(confirm("New version available. Load New Version?")) {
                window.location.reload();
            }
        });
      } else {
        console.log('swUpdate not enabled.');
      }
    }

  checkForUpdate() {
    console.log("checking if sw is enabled.")
      if (this.swUpdate.isEnabled) {
        this.swUpdate.checkForUpdate().then(() => {
          console.log("Checking for updates...");
        }).catch((error) => {
          console.log("Error when checking for update", error);
      });
    } else {
      console.log('swUpdate not enabled.');
    }
  }

  updateToLatest(): void {
    console.log('Update to latest version?');
    if(confirm("New version available. Load New Version?")) {
      // window.location.reload();
      this.swUpdate.activateUpdate().then(() => document.location.reload());
    }
  }
}
