import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NavController, Platform } from '@ionic/angular';
import { AlertService } from './services/alert.service';
import { AuthService } from './services/auth.service';
import { NetworkService } from './services/network.service';
import { ThemeService } from './services/theme.service';
import { UpdateService } from './services/update.service';
import { NotificationsService } from './services/notifications.service';
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

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    // {
    //   title: 'Home',
    //   url: '/home',
    //   icon: 'home'
    // },
    // {
    //   title: 'Notifications',
    //   url: '/notifications',
    //   icon: 'notifications'
    // },
    // {
    //   title: 'Hubs',
    //   url: '/hubs',
    //   icon: 'cube'
    // },
    // {
    //   title: 'People',
    //   url: '/people',
    //   icon: 'person'
    // },   
    {
      title: 'Settings',
      url: '/tabs/profile',
      icon: 'settings'
    },
    {
      title: 'Invite',
      url: '/tabs/invite',
      icon: 'add'
    }
  ];

  isDark = false;
  isNotFirstToggleSet = false;

  connected = true;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertService: AlertService,
    private themeService: ThemeService,
    private networkService: NetworkService,
    private updateService: UpdateService,
    private notificationsService: NotificationsService,
  ) {
    this.initializeApp();
    console.log(`Is DarkMode: ${this.isDark}`);
  }

  async initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.configureBackgroundGeolocation();
      //THIS SHOULD BE DONE CONDITIONALLY BY PLATFORM AND CONSOLIDATED INTO THE NOTIFICATIONS SERVICE
      //FOR iOS & ANDROID
      await this.notificationsService.setupPushForAllPlatforms();

      this.updateService.checkForUpdate();

      console.log(`Is DarkMode: ${this.isDark}`);
      this.isDark = await this.themeService.isDark();
      console.log(`Is DarkMode: ${this.isDark}`);

      this.connected = await this.networkService.isConnected();
      this.networkService.handler = this.networkService.network.addListener('networkStatusChange', async (status) => {
        console.log("Network status changed", status);
        this.connected = status.connected;
      });

      this.authService.getToken();
    });
  }

  configureBackgroundGeolocation() {
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
      debug: true,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      url: 'http://my.server.com/locations',
      autoSync: true,
      stopOnTerminate: true,
      startOnBoot: true
    }, (state) => {
      console.log('[ready] BackgroundGeolocation is ready to use');
      if (!state.enabled) {
        // 3.  Start tracking.
        BackgroundGeolocation.start();
      }
    });
  }

  async logout() {
    await this.authService.logout();
    this.alertService.presentToast('Logged Out');
    this.navCtrl.navigateRoot('/landing');
  }
}
