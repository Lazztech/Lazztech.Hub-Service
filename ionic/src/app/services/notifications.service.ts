import { Injectable } from '@angular/core';
import {firebase} from '@firebase/app';
import '@firebase/messaging';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { AuthService } from './auth.service';
import { Storage } from '@ionic/storage';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { InAppNotification } from '../models/inAppNotification';
const { LocalNotifications } = Plugins;

const { PushNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  firebaseConfig = {
    apiKey: "AIzaSyBBglG9CZgnduympgyS4mjSwVR8apl2Ztw",
    authDomain: "stack-push-notifications.firebaseapp.com",
    databaseURL: "https://stack-push-notifications.firebaseio.com",
    projectId: "stack-push-notifications",
    storageBucket: "",
    messagingSenderId: "770608014197",
    appId: "1:770608014197:web:95204a00ce87de89",
    vapidKey: 'BIt104gFwsv7X4-5R9vW9RIGV1TtMUHvRFsrMWWI5ez162UkiKbJpQL6Iq9n_ELYqG6FiTNLFQWidq-Kid6s9EE'
  };

  constructor(
    private apollo: Apollo,
    private authService: AuthService,
    private platform: Platform
    // private storage: Storage
  ) { }

  async localNotification(title: string, body: string, schedule?: Date): Promise<void> {
    let result = await LocalNotifications.areEnabled();
    if (!result.value) {
      let result = LocalNotifications.requestPermissions();
    }

    if (!schedule) {
      schedule = new Date(Date.now());
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          title: title,
          body: body,
          id: 1,
          // schedule: { at: new Date(Date.now() + 1000 * 5) },
          schedule: { at: schedule },
          sound: null,
          attachments: null,
          actionTypeId: "",
          extra: null
        }
      ]
    });
  }

  async getInAppNotifications(): Promise<InAppNotification[]> {
    const result = await this.apollo.query({
      query: gql`
        query {
          getInAppNotifications { 
            id
            text
            date
            thumbnail
            actionLink
          }
        }
      `,
      fetchPolicy: "no-cache"
    }).toPromise();

    console.log(result);

    return result.data['getInAppNotifications'];
  }

  async testPushNotificationToUser() {
    const me = await this.authService.user();
    const result = await this.apollo.query({
      query: gql`
      {
        sendPushNotification(userId: ${me.id})
      }
      `,
      fetchPolicy: "no-cache"
    }).toPromise();

    console.log(result);
  }

  async setupPushForAllPlatforms() {
    if (this.platform.is('android') || this.platform.is('ios')) {
      await this.setupPushiOSAndAndroid();
    } else {
      this.firebaseWebPushInitApp();
      await this.setupWebPush();
    }
  }

  async setupPushiOSAndAndroid() {
    //FOR iOS & ANDROID
    console.log("Setting up iOS/Android native push notifications.");

    PushNotifications.register();

    // const nativePushToken = await this.storage.get('native-push-token');    

    PushNotifications.addListener('registration', 
      (token: PushNotificationToken) => {
        // await this.storage.set('native-push-token', token.value);

        // alert('Push registration success, token: ' + token.value);
      }
    );

    PushNotifications.addListener('registrationError', 
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
        console.error('Error on registration: ' + JSON.stringify(error));
      }
    );

    PushNotifications.addListener('pushNotificationReceived', 
      (notification: PushNotification) => {
        alert('Push received: ' + JSON.stringify(notification));
      }
    );

    PushNotifications.addListener('pushNotificationActionPerformed', 
      (notification: PushNotificationActionPerformed) => {
        alert('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }

  setupWebPush(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        navigator.serviceWorker.ready.then((registration) => {
            // Don't crash an error if messaging not supported
            if (!firebase.messaging.isSupported()) {
                   resolve();
                   return;
            }

            const messaging = firebase.messaging();

            // Register the Service Worker
            messaging.useServiceWorker(registration);

            // Initialize your VAPI key
            messaging.usePublicVapidKey(
                  this.firebaseConfig.vapidKey
            );

            // Optional and not covered in the article
            // Listen to messages when your app is in the foreground
            messaging.onMessage((payload) => {
                console.log(payload);
            });
            // Optional and not covered in the article
            // Handle token refresh
            messaging.onTokenRefresh(() => {
                messaging.getToken().then(
                (refreshedToken: string) => {
                    console.log(refreshedToken);
                }).catch((err) => {
                    console.error(err);
                });
            });

            resolve();
        }, (err) => {
            reject(err);
        });
    });
  }

  firebaseWebPushInitApp() {
    firebase.initializeApp(this.firebaseConfig);
  }

  requestWebPushPermission(): Promise<void> {
    return new Promise<void>(async (resolve) => {
        if (!Notification) {
            resolve();
            return;
        }
        if (!firebase.messaging.isSupported()) {
            resolve();
            return;
        }
        try {
            const messaging = firebase.messaging();
            await messaging.requestPermission();

            const token: string = await messaging.getToken();

            console.log('User notifications token:', token);

            await this.submitNotificationToken(token);
        } catch (err) {
            // No notifications granted
        }

        resolve();
    });
  }

  private async submitNotificationToken(token: string) {
    const result = await this.apollo.mutate({
      mutation: gql`
        mutation {
          addUserFcmNotificationToken(token: "${token}")
        }
      `
    }).toPromise();

    if (result.data.addUserFcmNotificationToken) {
      console.log("addUserFcmNotificationToken successful.");
    } else {
      console.error("addUserFcmNotificationToken failed!");
    }
  }
  
}
