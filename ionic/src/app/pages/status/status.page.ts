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

  //Settings
  wifi = true;
  airplaneMode = true;
  ghostModeIsOff = true;
  lowPowerModeIsOff = false;
  //Permissions
  locationAlwaysPermission = true;

  constructor(
    private diagnostic: Diagnostic,
    private logger: NGXLogger
  ) { }

  async ngOnInit() {
    await this.checkSettings();
    await this.checkPermissions();
  }

  async checkSettings() {
    this.logger.log(this.checkSettings.name);
    this.wifi = await this.diagnostic.isWifiEnabled();
    // this.airplaneMode = await this.diagnostic.
  }

  async checkPermissions() {
    this.logger.log(this.checkPermissions.name);
    const permissions = this.diagnostic.permission;
    this.logger.log(permissions);
  }

  async activeGhostModeToggle() {
      const result = confirm('Hubs will no longer be updated of your presence!');
  }

}
