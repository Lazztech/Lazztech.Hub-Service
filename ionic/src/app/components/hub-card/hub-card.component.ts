import { Component, OnInit, Input } from '@angular/core';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-hub-card',
  templateUrl: './hub-card.component.html',
  styleUrls: ['./hub-card.component.scss'],
})
export class HubCardComponent implements OnInit {

  @Input()
  hub: any

  currentCoords: { latitude: number, longitude: number };
  
  atHub: boolean;

  private distanceInMeters: number;

  constructor(
    private locationService: LocationService
  ) { }

  async ngOnInit() {
    this.currentCoords = this.locationService.coords;
    this.distanceInMeters = await this.locationService.getDistanceFromHub(this.hub);
    this.atHub = await this.locationService.atHub(this.hub);
  }

}
