import { Injectable } from '@angular/core';
import BackgroundGeolocation, {
  State,
  Config,
  Location,
  LocationError,
  Geofence,
  HttpEvent,
  MotionActivityEvent,
  ProviderChangeEvent,
  MotionChangeEvent,
  GeofenceEvent,
  GeofencesChangeEvent,
  HeartbeatEvent,
  ConnectivityChangeEvent
} from "cordova-background-geolocation-lt";
import { Plugins } from '@capacitor/core';
import { HubService } from '../hub/hub.service';
import { Hub } from 'src/generated/graphql';
const { LocalNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class GeofenceService {

  constructor(
    private hubService: HubService
  ) { }

  async addGeofence(geofence: IGeofence) {
    BackgroundGeolocation.addGeofence({
      identifier: geofence.identifier,
      radius: 200,
      latitude: geofence.latitude,
      longitude: geofence.longitude,
      notifyOnEntry: geofence.notifyOnEntry,
      notifyOnExit: geofence.notifyOnExit,
      loiteringDelay: 20000,
      notifyOnDwell: true
      // extras: {
      //   route_id: 1234
      // }
    }).then((success) => {
      console.log("[addGeofence] success");
    }).catch((error) => {
      console.log("[addGeofence] FAILURE: ", error);
    });
  }

  async removeAllGeofences() {
    await BackgroundGeolocation.removeGeofences();
    console.log("[removeGeofences] all geofences have been destroyed");
  }

  async refreshHubGeofences() {
    await this.removeAllGeofences();
    const userHubs = await this.hubService.usersHubs();
    for (let index = 0; index < userHubs.length; index++) {
      const element = userHubs[index].hub;
      const identifier = {
        id: element.id,
        name: element.name
      };
      await this.addGeofence({
        identifier: JSON.stringify(identifier),
        latitude: element.latitude,
        longitude: element.longitude,
        notifyOnEntry: true,
        notifyOnExit: true,
        
      })

      console.log(`Added geofence for ${JSON.stringify(element)}`);
    }
  }

  async configureBackgroundGeolocation() {
    BackgroundGeolocation.onGeofence(async geofence => {
        console.log("[geofence] ", geofence.identifier, geofence.action);
        const hub = JSON.parse(geofence.identifier) as Hub;

        if (geofence.action == "ENTER") {
          await this.hubService.enteredHubGeofence(parseInt(hub.id)).catch(err => {
            LocalNotifications.schedule({
              notifications: [
                {
                  title: "Geofence error",
                  body: JSON.stringify(err),
                  id: parseInt(hub.id),
                  schedule: { at: new Date(Date.now()) },
                  sound: 'beep.aiff',
                  attachments: null,
                  actionTypeId: "",
                  extra: null,
                }
              ]
            })
          });

          LocalNotifications.schedule({
            notifications: [
              {
                title: "Entered " + hub.name,
                body: geofence.action + " " + hub.name,
                id: parseInt(hub.id),
                schedule: { at: new Date(Date.now()) },
                sound: 'beep.aiff',
                attachments: null,
                actionTypeId: "",
                extra: null
              }
            ]
          });
        }

        if (geofence.action == "EXIT") {
          await this.hubService.exitedHubGeofence(parseInt(hub.id) ).catch(err => {
            LocalNotifications.schedule({
              notifications: [
                {
                  title: "Geofence error",
                  body: JSON.stringify(err),
                  id: parseInt(hub.id),
                  schedule: { at: new Date(Date.now()) },
                  sound: 'beep.aiff',
                  attachments: null,
                  actionTypeId: "",
                  extra: null
                }
              ]
            })
          });

          LocalNotifications.schedule({
            notifications: [
              {
                title: "Exited " + hub.name,
                body: geofence.action + " " + hub.name,
                id: parseInt(hub.id),
                schedule: { at: new Date(Date.now()) },
                sound: 'beep.aiff',
                attachments: null,
                actionTypeId: "",
                extra: null
              }
            ]
          });
        }

        // if (geofence.action == "DWELL") {
        //   LocalNotifications.schedule({
        //     notifications: [
        //       {
        //         title: "Dwelling at " + hub.name,
        //         body: geofence.action + " " + hub.name,
        //         id: parseInt(hub.id),
        //         schedule: { at: new Date(Date.now()) },
        //         sound: 'beep.aiff',
        //         attachments: null,
        //         actionTypeId: "",
        //         extra: null
        //       }
        //     ]
        //   });
        // }
    });


    // 1.  Listen to events.
    BackgroundGeolocation.onLocation(location => {
      console.log('[location] - ', location);
    });

    BackgroundGeolocation.onMotionChange(event => {
      console.log('[motionchange] - ', event.isMoving, event.location);
    });

    BackgroundGeolocation.onHttp(response => {
      console.log('[http] - ', response.success, response.status, response.responseText);
    });

    BackgroundGeolocation.onProviderChange(event => {
      console.log('[providerchange] - ', event.enabled, event.status, event.gps);
    });

    // 2.  Configure the plugin with #ready
    BackgroundGeolocation.ready({
      reset: true,
      // debug: true,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      // url: 'http://my.server.com/locations',
      // autoSync: true,
      stopOnTerminate: false,
      startOnBoot: true
    }, (state) => {
      console.log('[ready] BackgroundGeolocation is ready to use');
      if (!state.enabled) {
        // 3.  Start tracking.
        BackgroundGeolocation.start();
      }
    });
  }
}

export interface IGeofence {
  identifier: string,
  // radius: number,
  latitude: number,
  longitude: number,
  notifyOnEntry: boolean,
  notifyOnExit: boolean
}