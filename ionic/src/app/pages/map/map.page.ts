import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, OnDestroy {

  queryParamsSubscription: Subscription;
  hubCoords: {latitude: number, longitude: number};

  constructor(
    private route : ActivatedRoute,
    private router: Router,
  ) { 
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.hubCoords = this.router.getCurrentNavigation().extras.state.hubCoords;
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.queryParamsSubscription.unsubscribe();
  }

}
