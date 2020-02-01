import { Component } from '@angular/core';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import {
  Plugins,
  StatusBarStyle,
} from '@capacitor/core';
const { StatusBar } = Plugins;
const { SplashScreen } = Plugins
import { NavController, Platform } from '@ionic/angular';
import { AlertService } from './services/alert.service';
import { AuthService } from './services/auth.service';
import { NetworkService } from './services/network.service';
import { ThemeService } from './services/theme.service';
import { UpdateService } from './services/update.service';
import { NotificationsService } from './services/notifications.service';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { GeofenceService } from './services/geofence.service';
import { DebuggerService } from './services/debugger.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
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
    // private splashScreen: SplashScreen,
    // private statusBar: StatusBar,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertService: AlertService,
    private themeService: ThemeService,
    private networkService: NetworkService,
    private updateService: UpdateService,
    private notificationsService: NotificationsService,
    private faio: FingerprintAIO,
    private geofenceService: GeofenceService,
    private debuggerService: DebuggerService
  ) {
    this.initializeApp();
    console.log(`Is DarkMode: ${this.isDark}`);
  }

  async initializeApp() {
    console.log(`Is DarkMode: ${this.isDark}`);
    this.isDark = await this.themeService.isDark();
    console.log(`Is DarkMode: ${this.isDark}`);

    StatusBar.setStyle({
      style: this.isDark ? StatusBarStyle.Dark : StatusBarStyle.Light
    });
    this.platform.ready().then(async () => {
      // this.splashScreen.hide();
      SplashScreen.hide();

      // this.debuggerService.start();

      //THIS SHOULD BE DONE CONDITIONALLY BY PLATFORM AND CONSOLIDATED INTO THE NOTIFICATIONS SERVICE
      //FOR iOS & ANDROID
      await this.notificationsService.setupPushForAllPlatforms();

      this.updateService.checkForUpdate();

      this.connected = await this.networkService.isConnected();
      this.networkService.handler = this.networkService.network.addListener('networkStatusChange', async (status) => {
        console.log("Network status changed", status);
        this.connected = status.connected;
      });

      this.authService.getToken();

      await this.geofenceService.configureBackgroundGeolocation();
      await this.geofenceService.refreshHubGeofences();

      //FIXME this may need more thought
      // this.platform.resume.subscribe(async () => {
      //   await this.faio.show({
      //     subtitle: "authorize"
      //   })
      // })
    });
  }

  

  async logout() {
    await this.authService.logout();
    this.alertService.presentToast('Logged Out');
    this.navCtrl.navigateRoot('/landing');
  }
}
