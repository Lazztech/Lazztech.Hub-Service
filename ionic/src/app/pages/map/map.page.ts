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
    private route: ActivatedRoute,
    private router: Router,
    private logger: NGXLogger
  ) {
    // this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
    //   if (this.router.getCurrentNavigation().extras.state) {
    //     this.hubCoords = this.router.getCurrentNavigation().extras.state.hubCoords;
    //     this.logger.log(this.hubCoords);
    //     this.loading = false;
    //   }
    // });
    if (this.router.getCurrentNavigation().extras.state) {
      this.hubCoords = this.router.getCurrentNavigation().extras.state.hubCoords;
      if (this.router.getCurrentNavigation().extras.state.hub) {
        this.hubs.push(this.router.getCurrentNavigation().extras.state.hub);
      }
      if (this.router.getCurrentNavigation().extras.state.hubs) {
        this.hubs = this.router.getCurrentNavigation().extras.state.hubs;
      }
      this.logger.log(this.hubCoords);
    }
  }

  async ngOnInit() {
  }
}
