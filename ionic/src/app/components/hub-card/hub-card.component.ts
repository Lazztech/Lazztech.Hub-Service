import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { LocationService } from 'src/app/services/location.service';
import { Observable, Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-hub-card',
  templateUrl: './hub-card.component.html',
  styleUrls: ['./hub-card.component.scss'],
})
export class HubCardComponent implements OnDestroy, OnChanges {

  @Input()
  hub: any
  
  atHub: boolean = false;

  coords$: Observable<{longitude: number, latitude: number}>;

  @Input()
  coords: {longitude: number, latitude: number};

  subscription: Subscription;

  private distanceInMeters: number;

  constructor(
    private locationService: LocationService,
    private changeRef: ChangeDetectorRef
  ) { }

  //FIXME: this may result in a memory leak without destroying the subscription
  async ngOnInit() {
    // this.subscription = this.locationService.coords$.subscribe(async x => {
    //   console.log(x);

    //   const coords = { latitude: x.latitude, longitude: x.longitude };
    //   console.log(coords);
    //   this.atHub = this.locationService.atHub(this.hub, coords);
    //   console.log(this.atHub);
    //   if (!this.atHub) {
    //     this.distanceInMeters = this.locationService.getDistanceFromHub(this.hub, coords);
    //     console.log(this.distanceInMeters);
    //   }
    //   this.changeRef.detectChanges();
    // });
  }

  ngOnChanges() {
      this.atHub = this.locationService.atHub(this.hub, this.coords);
      console.log(this.atHub);
      if (!this.atHub) {
        this.distanceInMeters = this.locationService.getDistanceFromHub(this.hub, this.coords);
        console.log(this.distanceInMeters);
      }
      this.changeRef.detectChanges();
  }

  async ngOnDestroy() {

  }

}
