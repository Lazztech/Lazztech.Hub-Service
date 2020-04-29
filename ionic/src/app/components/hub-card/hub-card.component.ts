import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { LocationService } from 'src/app/services/location/location.service';
import { Observable, Subscription, zip } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { HubService } from 'src/app/services/hub/hub.service';

@Component({
  selector: 'app-hub-card',
  templateUrl: './hub-card.component.html',
  styleUrls: ['./hub-card.component.scss'],
})
export class HubCardComponent implements OnDestroy, OnChanges {

  @Input()
  hub: any

  @Input()
  adminControls = false;

  @Input()
  showDescription = false;
  
  atHub: boolean = false;

  //FIXME is this used?
  coords$: Observable<{longitude: number, latitude: number}>;

  @Input()
  coords: {longitude: number, latitude: number};

  @Input()
  starred: boolean = false;

  @Input()
  isOwner: boolean = false;

  subscription: Subscription;
  presentCount = 0;

  private distanceInMeters: number;

  constructor(
    private locationService: LocationService,
    private changeRef: ChangeDetectorRef,
    private hubService: HubService
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
    this.presentCount = this.hub.usersConnection.filter(x => x.isPresent).length;
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

  async activeToggle($event) {
    console.log(this.hub.active);
    console.log($event)

    if ($event.detail.checked) {
      await this.hubService.activateHub(this.hub.id);
    } else {
      await this.hubService.deactivateHub(this.hub.id);
    }

    // this.active = !this.active;\\
  }

  async ngOnDestroy() {
  }

}
