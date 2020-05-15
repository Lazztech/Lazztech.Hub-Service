import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-status',
  templateUrl: './status.page.html',
  styleUrls: ['./status.page.scss'],
})
export class StatusPage implements OnInit {

  loading = false;
  wifi = true;
  airplaneMode = true;
  locationAlwaysPermission = true;
  ghostModeIsOff = true;
  lowPowerModeIsOff = true;

  constructor() { }

  ngOnInit() {
  }

  async activeGhostModeToggle() {
      const result = confirm('Hubs will no longer be updated of your presence!');
  }

}
