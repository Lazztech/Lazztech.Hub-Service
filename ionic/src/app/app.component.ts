import { Component } from '@angular/core';
import { Plugins, StatusBarStyle } from '@capacitor/core';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { NavController, Platform } from '@ionic/angular';
import { AlertService } from './services/alert/alert.service';
import { AuthService } from './services/auth/auth.service';
import { GeofenceService } from './services/geofence/geofence.service';
import { NetworkService } from './services/network/network.service';
import { ThemeService } from './services/theme/theme.service';
import { UpdateService } from './services/update/update.service';
import { NGXLogger } from 'ngx-logger';
const { StatusBar } = Plugins;
const { SplashScreen } = Plugins

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
    private authService: AuthService,
    private navCtrl: NavController,
    private alertService: AlertService,
    private themeService: ThemeService,
    private networkService: NetworkService,
    private updateService: UpdateService,
    private geofenceService: GeofenceService,
    private logger: NGXLogger,
  ) {
    this.initializeApp();
    this.logger.log(`Is DarkMode: ${this.isDark}`);
  }

  async initializeApp() {
    this.logger.log(`Is DarkMode: ${this.isDark}`);
    this.isDark = await this.themeService.isDark();
    this.logger.log(`Is DarkMode: ${this.isDark}`);

    StatusBar.setStyle({
      style: this.isDark ? StatusBarStyle.Dark : StatusBarStyle.Light
    });
    this.platform.ready().then(async () => {
      SplashScreen.hide();

      this.updateService.checkForUpdate();

      this.connected = await this.networkService.isConnected();
      this.networkService.handler = this.networkService.network.addListener('networkStatusChange', async (status) => {
        this.logger.log("Network status changed", status);
        this.connected = status.connected;
      });

      this.authService.getToken();

      await this.geofenceService.configureBackgroundGeolocation();
      await this.geofenceService.refreshHubGeofences();
    });
  }



  async logout() {
    await this.authService.logout();
    this.alertService.presentToast('Logged Out');
    this.navCtrl.navigateRoot('/landing');
  }
}
