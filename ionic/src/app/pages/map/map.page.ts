import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { GoogleMapComponent } from 'src/app/components/google-map/google-map.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  queryParamsSubscription: Subscription;
  hubCoords: any;
  hubs = [];

  hubId: number;
  loading = false;

  @ViewChild(GoogleMapComponent) child: GoogleMapComponent;

  constructor(
    private router: Router,
    private logger: NGXLogger
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.hubCoords = this.router.getCurrentNavigation().extras.state.hubCoords;
      if (this.router.getCurrentNavigation().extras.state.hub) {
        this.hubs.push(this.router.getCurrentNavigation().extras.state.hub);
      }
      if (this.router.getCurrentNavigation().extras.state.hubs) {
        this.hubs = this.router.getCurrentNavigation().extras.state.hubs;
      }
    }
  }

  async ngOnInit() {
  }
}
