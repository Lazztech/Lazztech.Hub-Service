import { Component, OnInit, Input } from '@angular/core';
import { LocationService } from 'src/app/services/location.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-hub-card',
  templateUrl: './hub-card.component.html',
  styleUrls: ['./hub-card.component.scss'],
})
export class HubCardComponent implements OnInit {

  @Input()
  hub: any
  
  atHub: boolean = false;

  private distanceInMeters: number;

  constructor(
    private locationService: LocationService
  ) { }

  //FIXME: this may result in a memory leak without destroying the subscription
  async ngOnInit() {
    this.locationService.watchLocation().subscribe(x => {
      console.log(x);
      const coords = { latitude: x.latitude, longitude: x.longitude };
      console.log(coords);
      this.atHub = this.locationService.atHub(this.hub, coords);
      console.log(this.atHub);
      if (!this.atHub) {
        this.distanceInMeters = this.locationService.getDistanceFromHub(this.hub, coords);
        console.log(this.distanceInMeters);
      }
    });
  }

}
