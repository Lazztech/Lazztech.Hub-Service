import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
/// <reference types="@types/googlemaps" />

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapComponent implements AfterViewInit {


  @Input()
  coords: { latitude: any; longitude: any; }
  // @ViewChild('map') mapElement;
  map: any;

  constructor() { }

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    console.log(this.coords);
    // const position = new google.maps.LatLng(this.coords.lat, this.coords.lng);
    const position = { lat: this.coords.latitude, lng: this.coords.longitude }
    console.log(position);
    let mapOptions: google.maps.MapOptions = {
      center: position,
      zoom: 14,
      disableDefaultUI: true,
      draggable: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    let marker = new google.maps.Marker({
      position: position,
      map: this.map
    });
  }
}
