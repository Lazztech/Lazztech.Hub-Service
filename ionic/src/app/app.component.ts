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

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Notifications',
      url: '/notifications',
      icon: 'notifications'
    },
    {
      title: 'People',
      url: '/people',
      icon: 'person'
    },   
    {
      title: 'Profile',
      url: '/profile',
      icon: 'settings'
    },
    {
      title: 'Invite',
      url: '/invite',
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

  async toggleTheme() {
    if (!this.isNotFirstToggleSet) {
      this.isNotFirstToggleSet = true;
      console.log('setting isNotFirstToggleSet = true')
      console.log(`Is DarkMode: ${this.isDark}`);
      if (this.isDark) {
        return;
      }
    }

    if (this.isNotFirstToggleSet) {
      console.log("toggling theme");
      await this.themeService.toggle();
    } 
  }
}
