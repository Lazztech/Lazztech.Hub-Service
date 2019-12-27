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
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';

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
    private backgroundGeolocation: BackgroundGeolocation
  ) {
    this.initializeApp();
    console.log(`Is DarkMode: ${this.isDark}`);
  }

  async initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      const config: BackgroundGeolocationConfig = {
        desiredAccuracy: 10,
        stationaryRadius: 20,
        distanceFilter: 30,
        debug: true, //  enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: false, // enable this to clear background location settings when the app terminates
      };

      this.backgroundGeolocation.configure(config)
      .then(() => {

      this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
        console.log(location);

        // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
        // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
        // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
        this.backgroundGeolocation.finish(); // FOR IOS ONLY
      });

      });

      // start recording location
      this.backgroundGeolocation.start();

      // If you wish to turn OFF background-tracking, call the #stop method.
      // this.backgroundGeolocation.stop();

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

  async logout() {
    await this.authService.logout();
    this.alertService.presentToast('Logged Out');
    this.navCtrl.navigateRoot('/landing');
  }
}
