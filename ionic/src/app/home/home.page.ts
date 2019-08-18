import { Component, AfterViewInit, OnInit } from '@angular/core';
import { MenuController, Platform, NavController } from '@ionic/angular';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { UpdateService } from '../services/update.service';
import { PwaInstallService } from '../services/pwa-install.service';
import { Observable, of } from 'rxjs';
import { NotificationsService } from '../services/notifications.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {

  user: User;
  updateReady = false;
  beforeInstall: Observable<boolean> = of(false);
  inAppNotificationCount = 0;
  
  constructor(
    private menu: MenuController,
    private authService: AuthService,
    private updateService: UpdateService,
    private pwaInstallService: PwaInstallService,
    private platform: Platform,
    private notificationsService: NotificationsService,
    public navCtrl: NavController
    ) { 
    this.menu.enable(true);
    this.beforeInstall = pwaInstallService.beforeInstall;
    this.updateService.checkForUpdate();
    if (this.updateService.swUpdate.isEnabled) {
      this.updateService.updateAvailable = this.updateService.swUpdate.available;
      this.updateService.swUpdate.available.subscribe(() => {
          // if(confirm("New version available. Load New Version?")) {
          //     window.location.reload();
          // }

          this.updateReady = true;
      });
    }

    pwaInstallService.showInstallBanner();
  }

  goToNotifications() {
    this.navCtrl.navigateRoot('notifications');
  }

  async ionViewWillEnter() {
    this.user = await this.authService.user();
    this.inAppNotificationCount = await this.notificationsService.getInAppNotifications().then(x => x.length);
  }

  async ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.platform.ready().then(async () => {
       await this.notificationsService.requestWebPushPermission();
    });
  }

  installAppPrompt() {
    this.pwaInstallService.showInstallBanner();
  }

  update() {
    console.log('updating...');
    this.updateService.updateToLatest();
  }

  async testPushNotification() {
    await this.notificationsService.testPushNotificationToUser();
  }
  
}
