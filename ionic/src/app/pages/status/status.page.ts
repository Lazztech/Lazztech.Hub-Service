import { Component, OnInit } from '@angular/core';
import { DiagnosticService } from 'src/app/services/diagnostic/diagnostic.service';
import { DevicePermissions } from 'src/app/services/diagnostic/models/devicePermissions';
import { DeviceSettings } from 'src/app/services/diagnostic/models/deviceSettings';

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
  deviceSettings: DeviceSettings;
  //Permissions
  devicePermissions: DevicePermissions;

  constructor(
    private diagnosticService: DiagnosticService,
  ) { }

  async ngOnInit() {
    this.loading = true;
    this.deviceSettings = await this.diagnosticService.checkIosSettings();
    this.devicePermissions = await this.diagnosticService.checkIosPermissions();
    this.loading = false;
  }

  async activeGhostModeToggle() {
    const result = confirm('Hubs will no longer be updated of your presence!');
  }

}
