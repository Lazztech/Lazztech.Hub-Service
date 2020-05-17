import { Component, OnInit } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { NGXLogger } from 'ngx-logger';
import { NetworkService } from 'src/app/services/network/network.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.page.html',
  styleUrls: ['./status.page.scss'],
})
export class StatusPage implements OnInit {

  loading = false;

  //Ghost Mode
  ghostModeIsOff = true;

  //Device Settings
  // lowPowerModeIsOff = false;
  locationServices = false;
  internetConnectivity = false;
  // cellular = false;
  wifi = false;

  //Permissions
  locationPermission = false;
  motionAndFitnessPermission = false;
  backgroundAppRefreshPermission = false;

  constructor(
    private diagnostic: Diagnostic,
    private networkService: NetworkService,
    private logger: NGXLogger
  ) { }

  async ngOnInit() {
    await this.checkIosSettings();
    await this.checkIosPermissions();
  }

  async checkIosSettings() {
    this.logger.log(this.checkIosSettings.name);
    // this.lowPowerModeIsOff = 
    this.locationServices = await this.diagnostic.isLocationEnabled();
    // this.cellular = await this.diagnostic.cellular
    this.internetConnectivity = await this.networkService.isConnected();
    this.wifi = await this.diagnostic.isWifiEnabled();
  }

  async checkIosPermissions() {
    this.logger.log(this.checkIosPermissions.name);
    this.checkIosLocationPermissions();
    this.checkIosMotionPermission();
    await this.checkIosBackgroundRefreshPermission();
  }

  private checkIosLocationPermissions() {
    //TODO: this doesn't distinguish between ios "while using app" vs "always" permission mode.
    this.diagnostic.getLocationAuthorizationStatus().then(result => {
      this.logger.log('getLocationAuthorizationStatus', result);
      // this.logger.log('this.diagnostic.locationAuthorizationMode', this.diagnostic.locationAuthorizationMode);
      // this.locationAlwaysPermission = (result == this.diagnostic.locationAuthorizationMode.ALWAYS);
      this.locationPermission = (result == 'authorized');
    });
  }

  private async checkIosBackgroundRefreshPermission() {
    this.backgroundAppRefreshPermission = await this.diagnostic.isBackgroundRefreshAuthorized();
  }

  private checkIosMotionPermission() {
    this.diagnostic.getMotionAuthorizationStatus().then(result => {
      this.logger.log('getMotionAuthorizationStatus result: ', result);
      /* this.diagnostic.motionStatus.GRANTED:
      {
        "UNKNOWN":"unknown",
        "NOT_REQUESTED":"not_requested",
        "DENIED_ALWAYS":"denied_always",
        "RESTRICTED":"restricted",
        "GRANTED":"authorized",
        "NOT_AVAILABLE":"not_available",
        "NOT_DETERMINED":"not_determined"
      }
      */
      this.motionAndFitnessPermission = (result == this.diagnostic.motionStatus.GRANTED);
    });
  }

  async activeGhostModeToggle() {
    const result = confirm('Hubs will no longer be updated of your presence!');
  }

}
