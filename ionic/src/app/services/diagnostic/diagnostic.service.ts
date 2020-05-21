import { Injectable } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { NetworkService } from '../network/network.service';
import { GeofenceService } from '../geofence/geofence.service';
import { NGXLogger } from 'ngx-logger';
import { DeviceSettings } from './models/deviceSettings';
import { DevicePermissions } from './models/devicePermissions';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticService {

  //Device Settings
  private lowPowerMode = false;
  private locationServices = false;
  private internetConnectivity = false;
  // cellular = false;
  private wifi = false;

  //Permissions
  private locationPermission = false;
  private motionAndFitnessPermission = false;
  private backgroundAppRefreshPermission = false;

  constructor(
    private diagnostic: Diagnostic,
    private networkService: NetworkService,
    private geofenceService: GeofenceService,
    private logger: NGXLogger
  ) { }

  async checkIosSettings(): Promise<DeviceSettings> {
    this.logger.log(this.checkIosSettings.name);
    this.logger.log('this.geofenceService.isPowerSaveMode() result: ', await this.geofenceService.isPowerSaveMode())
    this.lowPowerMode = await this.geofenceService.isPowerSaveMode();
    //TODO: low data mode?
    this.locationServices = await this.diagnostic.isLocationEnabled();
    // this.cellular = await this.diagnostic.cellular
    this.internetConnectivity = await this.networkService.isConnected();
    this.wifi = await this.diagnostic.isWifiEnabled();

    return {
      lowPowerMode: this.lowPowerMode,
      locationServices: this.locationServices,
      internetConnectivity: this.internetConnectivity,
      wifi: this.wifi
    } as DeviceSettings;
  }

  async checkIosPermissions() {
    this.logger.log(this.checkIosPermissions.name);
    await this.checkIosLocationPermissions();
    await this.checkIosMotionPermission();
    await this.checkIosBackgroundRefreshPermission();
    return {
      locationPermission: this.locationPermission,
      backgroundAppRefreshPermission: this.backgroundAppRefreshPermission,
      motionAndFitnessPermission: this.motionAndFitnessPermission
    } as DevicePermissions;
  }

  private async checkIosLocationPermissions() {
    //TODO: this doesn't distinguish between ios "while using app" vs "always" permission mode.
    const result = await this.diagnostic.getLocationAuthorizationStatus();
    this.logger.log('getLocationAuthorizationStatus', result);
    // this.logger.log('this.diagnostic.locationAuthorizationMode', this.diagnostic.locationAuthorizationMode);
    // this.locationAlwaysPermission = (result == this.diagnostic.locationAuthorizationMode.ALWAYS);
    this.locationPermission = (result == 'authorized');
  }

  private async checkIosBackgroundRefreshPermission() {
    this.backgroundAppRefreshPermission = await this.diagnostic.isBackgroundRefreshAuthorized();
  }

  private async checkIosMotionPermission() {
    const result = await this.diagnostic.getMotionAuthorizationStatus();
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
  }
}
