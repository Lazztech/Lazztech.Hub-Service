import { Injectable } from '@angular/core';
import { Plugins, GeolocationPosition, GeolocationOptions } from '@capacitor/core';
import * as geolib from 'geolib';
import { Observable, Observer } from 'rxjs';

const { Geolocation } = Plugins;


@Injectable({
  providedIn: 'root'
})
export class LocationService {

  coords$: Observable<{ latitude: number, longitude: number }>;

  constructor() {
    this.coords$ = this.watchLocation();
   }

  /**
   * 
   * @param hub
   * @param distance optional param with default of 50 meters
   */
  atHub(hub: any, coords: any, distance: number = 50) {
    const hubCoords = { latitude: hub.latitude, longitude: hub.longitude };
    const result = geolib.isPointWithinRadius(
      coords,
      hubCoords,
      distance
    );
    return result;
  }

  async getCurrentPosition() {
      const coordinates = await Geolocation.getCurrentPosition();
      return coordinates;
  }

  private watchLocation(minuteInterval: number = 1):Observable<{ latitude: number, longitude: number}> {
    // const geoLocationPosition = await this.getCurrentPosition();
    // this.coords = { latitude: geoLocationPosition.coords.latitude, longitude: geoLocationPosition.coords.longitude };

    // const ms = (minuteInterval * 60) * 1000;
    // setInterval(async () => {
    //   const geoLocationPosition = await this.getCurrentPosition();
    //   this.coords = { latitude: geoLocationPosition.coords.latitude, longitude: geoLocationPosition.coords.longitude };
    // }, ms);

    const result = Observable.create(
      (observer: Observer<{ latitude: number, longitude: number}>) => {
        Geolocation.watchPosition({ enableHighAccuracy: true }, (x: GeolocationPosition, err) => {
        if (err){
          console.log(err);
        }
        const coords = { latitude: x.coords.latitude, longitude: x.coords.longitude };
        observer.next(coords);
        // observer.complete();
      });
    });

      return result;
  }

  /**
   * 
   * @param hub 
   * @returns distance in meters
   */
  getDistanceFromHub(hub: any, coords: any) {
    const hubCoords = { latitude: hub.latitude, longitude: hub.longitude };

    const distance = geolib.getDistance(
      coords,
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
