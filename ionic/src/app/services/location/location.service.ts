import { Injectable } from '@angular/core';
import { GeolocationOptions, GeolocationPosition, Plugins } from '@capacitor/core';
import * as geolib from 'geolib';
import { NGXLogger } from 'ngx-logger';
import { Observable, Observer } from 'rxjs';
import { Hub } from 'src/generated/graphql';

const { Geolocation } = Plugins;


@Injectable({
  providedIn: 'root'
})
export class LocationService {

  coords$: Observable<{ latitude: number, longitude: number }>;

  constructor(
    private logger: NGXLogger
  ) {
    this.coords$ = this.watchLocation();
   }

  atHub(hub: any, coords: any, distance: number = 200) {
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
    const result = Observable.create(
      (observer: Observer<{ latitude: number, longitude: number}>) => {
        const id = Geolocation.watchPosition({ enableHighAccuracy: true }, (x: GeolocationPosition, err) => {
        // Geolocation.clearWatch({id});
        if (err){
          this.logger.log(err);
          // observer.complete();
        }
        const coords = { latitude: x.coords.latitude, longitude: x.coords.longitude };
        observer.next(coords);
      });
    });

      return result;
  }

  getDistanceFromHub(hub: Hub, coords: any) {
    const hubCoords = { latitude: hub.latitude, longitude: hub.longitude };
    const distance = geolib.getDistance(
      coords,
      hubCoords
    );
    this.logger.log(`distanceInMeters from hubId ${hub.id}: ` + distance);
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
