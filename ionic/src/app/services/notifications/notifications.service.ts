import { Injectable } from '@angular/core';
import { Plugins, PushNotification, PushNotificationActionPerformed, PushNotificationToken } from '@capacitor/core';
import { firebase } from '@firebase/app';
import '@firebase/messaging';
import { Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FetchPolicy } from 'apollo-client';
import { AddUserFcmNotificationTokenGQL, DeleteAllInAppNotificationsGQL, DeleteInAppNotificationGQL, GetInAppNotificationsGQL, InAppNotification, Scalars } from '../../../generated/graphql';
const { LocalNotifications, PushNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  //FIXME move this to the Ionic environments file
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
    private platform: Platform,
    private storage: Storage,
    private toastController: ToastController,
    private deleteAllInAppNotificationsGQLService: DeleteAllInAppNotificationsGQL,
    private getInAppNotificationsGQLService: GetInAppNotificationsGQL,
    private deleteInAppNotificationGQLService: DeleteInAppNotificationGQL,
    private addUserFcmNotificationTokenGQLService: AddUserFcmNotificationTokenGQL
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

  async getInAppNotifications(fetchPolicy: FetchPolicy = "network-only"): Promise<InAppNotification[]> {
    const result = await this.getInAppNotificationsGQLService.fetch(
      null,
      {
        fetchPolicy
      }
    ).toPromise();

    console.log(result);
    return result.data.getInAppNotifications;
  }

  async deleteInAppNotification(inAppNotificationId: Scalars['ID']) {
    const result = await this.deleteInAppNotificationGQLService.mutate({
      inAppNotificationId
    }).toPromise();

    if (result.data.deleteInAppNotification) {
      console.log("deleteInAppNotification successful.");
      return true;
    } else {
      console.error("deleteInAppNotification failed!");
      return false;
    }
  }

  async deleteAllInAppNotifications() {
    const result = await this.deleteAllInAppNotificationsGQLService.mutate().toPromise();

    if (result.data.deleteAllInAppNotifications) {
      console.log("deleteAllInAppNotifications successful.");
    } else {
      console.error("deleteAllInAppNotifications failed!");
    }
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

    //TODO Remove?
    // const nativePushToken = await this.storage.get('native-push-token');
    // if (nativePushToken) {
    //   await this.submitNotificationToken(nativePushToken);
    // }

    PushNotifications.addListener('registration', 
      async (token: PushNotificationToken) => {
        await this.storage.set('native-push-token', token.value);
        await this.submitNotificationToken(token.value);

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
      async (notification: PushNotification) => {
        // alert('Push received: ' + JSON.stringify(notification));
        //TODO move to alertService?
        const toast = await this.toastController.create({
          header: notification.title,
          message: notification.body,
          duration: 2000,
          position: 'top',
          color: 'dark'
        });
        console.log("presenting toast");
        await toast.present();
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
    const result = await this.addUserFcmNotificationTokenGQLService.mutate({
      token
    }).toPromise();

    if ((result as any).data.addUserFcmNotificationToken) {
      console.log("addUserFcmNotificationToken successful.");
    } else {
      console.error("addUserFcmNotificationToken failed!");
    }
  }
  
}
