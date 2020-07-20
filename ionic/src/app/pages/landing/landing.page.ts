import { Component, OnInit } from '@angular/core';
import { RegisterPage } from '../auth/register/register.page';
import { LoginPage } from '../auth/login/login.page';
import { ModalController, MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { NGXLogger } from 'ngx-logger';
import { AlertService } from 'src/app/services/alert/alert.service';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  constructor(
    private modalController: ModalController,
    private menu: MenuController,
    private authService: AuthService,
    private navCtrl: NavController,
    private faio: FingerprintAIO,
    private notificationsService: NotificationsService,
    private logger: NGXLogger,
    private alertService: AlertService
  ) { 
    this.menu.enable(false);
  }

  ionViewWillEnter() {
    this.authService.getToken().then(() => {
      if(this.authService.isLoggedIn) {
        this.faio.show({
          subtitle: "authorize"
        }).then(() => {
          //FIXME is this how I want this? It needs token to work on first launch.
          this.notificationsService.setupPushForAllPlatforms();

          this.navCtrl.navigateRoot('/tabs');
        }).catch(err => this.logger.error(err));
      }
    });
  }

  ngOnInit() {
    
  }

  async register() {
    const registerModal = await this.modalController.create({
      component: RegisterPage,
      swipeToClose: true,
    });
    return await registerModal.present();
  }
  
  async login() {
    const loginModal = await this.modalController.create({
      component: LoginPage,
      swipeToClose: true,
    });
    return await loginModal.present();
  }

  async triggerBioAuth() {
    this.authService.getToken().then(() => {
      if(this.authService.isLoggedIn) {
        this.faio.show({
          subtitle: "authorize"
        }).then(() => {
          //FIXME is this how I want this? It needs token to work on first launch.
          this.notificationsService.setupPushForAllPlatforms();

          this.navCtrl.navigateRoot('/tabs');
        }).catch(err => this.logger.error(err));
      } else {
        this.alertService.presentRedToast("You must have logged into an active account recently.");
      }
    });
  }

}
