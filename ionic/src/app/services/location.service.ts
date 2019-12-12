import { Injectable } from '@angular/core';
import { Plugins, GeolocationPosition, GeolocationOptions } from '@capacitor/core';
import * as geolib from 'geolib';
const { Geolocation } = Plugins;


@Injectable({
  providedIn: 'root'
})
export class LocationService {

  //FIXME: make this an observable. It should always resolve to a valid result. Right now it starts undefined.
  coords: { latitude: number, longitude: number };

  constructor() {
    // this.coords = {latitude: 0, longitude: 0};
    this.watchLocation();
   }

  /**
   * 
   * @param hub
   * @param distance optional param with default of 50 meters
   */
  async atHub(hub: any, distance: number = 50) {
    const hubCoords = { latitude: hub.latitude, longitude: hub.longitude };

    const result = geolib.isPointWithinRadius(
      this.coords,
      hubCoords,
      distance
    );
    return result;
  }

  async getCurrentPosition() {
      const coordinates = await Geolocation.getCurrentPosition();
      return coordinates;
  }

  async watchLocation(minuteInterval: number = 1) {
    const geoLocationPosition = await this.getCurrentPosition();
    this.coords = { latitude: geoLocationPosition.coords.latitude, longitude: geoLocationPosition.coords.longitude };

    const ms = (minuteInterval * 60) * 1000;
    setInterval(async () => {
      const geoLocationPosition = await this.getCurrentPosition();
      this.coords = { latitude: geoLocationPosition.coords.latitude, longitude: geoLocationPosition.coords.longitude };
    }, ms);
  }

  /**
   * 
   * @param hub 
   * @returns distance in meters
   */
  async getDistanceFromHub(hub: any) {
    const hubCoords = { latitude: hub.latitude, longitude: hub.longitude };

    const distance = geolib.getDistance(
      this.coords,
      hubCoords
    );

    return distance;
  }


  getCurrentPositionFastIos = async (options: GeolocationOptions = {}): Promise<GeolocationPosition> => {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      const id = Geolocation.watchPosition(options, (position, err) => {
        Geolocation.clearWatch({id});
        if(err) {
          reject(err);
          return;
        }
        resolve(position);
      });
    });
  };

}
