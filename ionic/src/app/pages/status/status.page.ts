import { Component, OnInit } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { NGXLogger } from 'ngx-logger';

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
  lowPowerModeIsOff = false;
  locationServices = false;
  cellular = false;
  wifi = true;

  //Permissions
  locationAlwaysPermission = false;
  motionAndFitnessPermission = false;
  backgroundAppRefreshPermission = false;

  constructor(
    private diagnostic: Diagnostic,
    private logger: NGXLogger
  ) { }

  async ngOnInit() {
    await this.checkIosSettings();
    await this.checkIosPermissions();
  }

  async checkIosSettings() {
    this.logger.log(this.checkIosSettings.name);
    this.wifi = await this.diagnostic.isWifiEnabled();
    this.locationServices = await this.diagnostic.isLocationEnabled();
  }

  async checkIosPermissions() {
    this.logger.log(this.checkIosPermissions.name);
    this.logger.log('getLocationAuthorizationStatus result: ', await this.diagnostic.getLocationAuthorizationStatus()); // returns 'authorized'
    this.logger.log('requestLocationAuthorization result: ', await this.diagnostic.requestLocationAuthorization());
    this.logger.log('requestLocationAuthorization("always") result: ', await this.diagnostic.requestLocationAuthorization("always"));

    this.diagnostic.requestLocationAuthorization(this.diagnostic.locationAuthorizationMode.ALWAYS).then(result => {
      this.logger.log('getLocationAuthorizationStatus result: ', result);
      this.locationAlwaysPermission = (result == this.diagnostic.locationAuthorizationMode.ALWAYS);
    });

    this.diagnostic.getMotionAuthorizationStatus().then(result => {
      this.logger.log('getMotionAuthorizationStatus result: ', result);
      this.motionAndFitnessPermission = (result == this.diagnostic.motionStatus.GRANTED);
    });

    this.backgroundAppRefreshPermission = await this.diagnostic.isBackgroundRefreshAuthorized();
  }

  async activeGhostModeToggle() {
      const result = confirm('Hubs will no longer be updated of your presence!');
  }

}
