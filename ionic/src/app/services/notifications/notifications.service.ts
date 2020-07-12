import { Injectable } from '@angular/core';
import { Plugins, PushNotification, PushNotificationActionPerformed, PushNotificationToken } from '@capacitor/core';
import { firebase } from '@firebase/app';
import '@firebase/messaging';
import { Platform, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FetchPolicy } from 'apollo-client';
import { AddUserFcmNotificationTokenGQL, DeleteAllInAppNotificationsGQL, DeleteInAppNotificationGQL, GetInAppNotificationsGQL, InAppNotification, Scalars, GetInAppNotificationsDocument, GetInAppNotificationsQuery } from '../../../generated/graphql';
import { NGXLogger } from 'ngx-logger';
import { environment } from 'src/environments/environment';
const { LocalNotifications, PushNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private platform: Platform,
    private storage: Storage,
    private toastController: ToastController,
    private deleteAllInAppNotificationsGQLService: DeleteAllInAppNotificationsGQL,
    private getInAppNotificationsGQLService: GetInAppNotificationsGQL,
    private deleteInAppNotificationGQLService: DeleteInAppNotificationGQL,
    private addUserFcmNotificationTokenGQLService: AddUserFcmNotificationTokenGQL,
    private logger: NGXLogger
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

  watchGetInAppNotifications(fetchPolicy: FetchPolicy = "cache-first") {
    return this.getInAppNotificationsGQLService.watch(
      null,
      {
        fetchPolicy
      }
    );
  }

  async getInAppNotifications(fetchPolicy: FetchPolicy = "cache-first"): Promise<InAppNotification[]> {
    const result = await this.getInAppNotificationsGQLService.fetch(
      null,
      {
        fetchPolicy
      }
    ).toPromise();

    this.logger.log(result);
    return result.data.getInAppNotifications;
  }

  async deleteInAppNotification(inAppNotificationId: Scalars['ID']) {
    const result = await this.deleteInAppNotificationGQLService.mutate({
      inAppNotificationId
    },
    {
      update: (proxy, { data: { deleteInAppNotification } }) => {
        // Read the data from our cache for this query.
        const data = proxy.readQuery({ query: GetInAppNotificationsDocument }) as GetInAppNotificationsQuery;

        // Find out notification by id and splice to remove it.
        const notification = data.getInAppNotifications.find(x => x.id == inAppNotificationId);
        data.getInAppNotifications.splice(data.getInAppNotifications.indexOf(notification), 1);

        // Write our data back to the cache.
        proxy.writeQuery({ query: GetInAppNotificationsDocument, data });
      },
    }
    ).toPromise();

    if (result.data.deleteInAppNotification) {
      this.logger.log("deleteInAppNotification successful.");
      return true;
    } else {
      this.logger.error("deleteInAppNotification failed!");
      return false;
    }
  }

  async deleteAllInAppNotifications() {
    const result = await this.deleteAllInAppNotificationsGQLService.mutate(null, {
      update: (proxy, { data: { deleteAllInAppNotifications } }) => {
        // Read the data from our cache for this query.
        const data = proxy.readQuery({ query: GetInAppNotificationsDocument }) as GetInAppNotificationsQuery;

        // Clear out notifications.
        data.getInAppNotifications = [];

        // Write our data back to the cache.
        proxy.writeQuery({ query: GetInAppNotificationsDocument, data });
      },
    }).toPromise();

    if (result.data.deleteAllInAppNotifications) {
      this.logger.log("deleteAllInAppNotifications successful.");
    } else {
      this.logger.error("deleteAllInAppNotifications failed!");
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
    this.logger.log("Setting up iOS/Android native push notifications.");

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
        this.logger.error('Error on registration: ' + JSON.stringify(error));
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
        this.logger.log("presenting toast");
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
                  environment.firebaseConfig.vapidKey
            );

            // Optional and not covered in the article
            // Listen to messages when your app is in the foreground
            messaging.onMessage((payload) => {
                this.logger.log(payload);
            });
            // Optional and not covered in the article
            // Handle token refresh
            messaging.onTokenRefresh(() => {
                messaging.getToken().then(
                (refreshedToken: string) => {
                    this.logger.log(refreshedToken);
                }).catch((err) => {
                    this.logger.error(err);
                });
            });

            resolve();
        }, (err) => {
            reject(err);
        });
    });
  }

  firebaseWebPushInitApp() {
    firebase.initializeApp(environment.firebaseConfig);
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

            this.logger.log('User notifications token:', token);

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
      this.logger.log("addUserFcmNotificationToken successful.");
    } else {
      this.logger.error("addUserFcmNotificationToken failed!");
    }
  }
  
}
