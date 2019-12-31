import { Component, OnInit } from '@angular/core';
import { RegisterPage } from '../auth/register/register.page';
import { LoginPage } from '../auth/login/login.page';
import { ModalController, MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';


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
    private faio: FingerprintAIO
  ) { 
    this.menu.enable(false);
  }

  ionViewWillEnter() {
    this.authService.getToken().then(() => {
      if(this.authService.isLoggedIn) {
        this.faio.show({
          subtitle: "authorize"
        }).then(() => {
          this.navCtrl.navigateRoot('/tabs');
        }).catch(err => console.error(err));
      }
    });
  }

  ngOnInit() {
    
  }

  async register() {
    const registerModal = await this.modalController.create({
      component: RegisterPage
    });
    return await registerModal.present();
  }
  
  async login() {
    const loginModal = await this.modalController.create({
      component: LoginPage,
    });
    return await loginModal.present();
  }

}
