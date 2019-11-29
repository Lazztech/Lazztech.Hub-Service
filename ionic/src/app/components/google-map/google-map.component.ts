import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
/// <reference types="@types/googlemaps" />

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapComponent implements AfterViewInit {

  // @ViewChild('map') mapElement;
  map: any;

  constructor() { }

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    let coords = new google.maps.LatLng(47.5421318, -122.1755343);
    let mapOptions: google.maps.MapOptions = {
      center: coords,
      zoom: 14,
      disableDefaultUI: true,
      draggable: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    let marker = new google.maps.Marker({
      position: coords,
      map: this.map
    });
  }
}
