import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import * as geolib from 'geolib';
const { Geolocation } = Plugins;


@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  /**
   * 
   * @param hub 
   * @param currentCoords optional param if not provided will grab the current coords for you
   * @param distance optional param with default of 50 meters
   */
  async atHub(hub: any, currentCoords?: { latitude: number, longitude: number }, distance: number = 50) {
    const hubCoords = { latitude: hub.latitude, longitude: hub.longitude };

    if(!currentCoords) {
      const geoLocationPosition = await this.getCurrentPosition();
      currentCoords = { latitude: geoLocationPosition.coords.latitude, longitude: geoLocationPosition.coords.longitude };
    }

    const result = geolib.isPointWithinRadius(
      currentCoords,
      hubCoords,
      distance
    );
    return result;
  }

  async getCurrentPosition() {
      const coordinates = await Geolocation.getCurrentPosition();
      return coordinates;
  }

  /**
   * 
   * @param hub 
   * @param currentCoords optional param if not provided will grab the current coords for you
   * @returns distance in meters
   */
  async getDistanceFromHub(hub: any, currentCoords?: { latitude: number, longitude: number }) {
    const hubCoords = { latitude: hub.latitude, longitude: hub.longitude };

    if(!currentCoords) {
      const geoLocationPosition = await this.getCurrentPosition();
      currentCoords = { latitude: geoLocationPosition.coords.latitude, longitude: geoLocationPosition.coords.longitude };
    }

    const distance = geolib.getDistance(
      currentCoords,
      hubCoords
    );

    return distance;
  }

}
