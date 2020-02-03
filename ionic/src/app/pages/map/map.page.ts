import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HubService } from 'src/app/services/hub.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, OnDestroy, AfterViewInit {

  queryParamsSubscription: Subscription;
  hubCoords: any;

  hubId: number;
  loading = false;

  constructor(
    private route : ActivatedRoute,
    private router: Router,
    private hubService: HubService,
  ) { 
    // this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
    //   if (this.router.getCurrentNavigation().extras.state) {
    //     this.hubCoords = this.router.getCurrentNavigation().extras.state.hubCoords;
    //     console.log(this.hubCoords);
    //     this.loading = false;
    //   }
    // });
    // if (this.router.getCurrentNavigation().extras.state) {
      // this.hubCoords = this.router.getCurrentNavigation().extras.state.hubCoords;
      // console.log(this.hubCoords);
    // }
    // this.hubCoords = {latitude: 47.5421555, longitude: -122.1732493};
    // console.log(this.hubCoords);
    // // this.loading = false;
  }

  async ngOnInit() {
    this.hubId = parseInt(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    const userHub = await this.hubService.hub(this.hubId);
    
    const hubCoords = { 
      latitude: userHub.hub.latitude,
      longitude: userHub.hub.longitude
    };
    this.hubCoords = hubCoords;
    this.loading = false;
  }
}
