import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RegisterPage } from '../register/register.page';
import { ResetPinPage } from '../reset-pin/reset-pin.page';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loading = false;

  myForm: FormGroup;

  get email() {
    return this.myForm.get('email');
  }

  get password() {
    return this.myForm.get('password');
  }

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertService: AlertService,
    private fb: FormBuilder,
    private notificationsService: NotificationsService,
    private logger: NGXLogger
    ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(10)
      ]]
    });
  }

  dismissLogin() {
    this.modalController.dismiss();
  }

  async registerModal() {
    this.dismissLogin();
    const registerModal = await this.modalController.create({
      component: RegisterPage,
      swipeToClose: true,
    });
    return await registerModal.present();
  }

  async resetModal() {
    this.dismissLogin();
    const resetModal = await this.modalController.create({
      component: ResetPinPage,
      swipeToClose: true,
    });
    return await resetModal.present();
  }

  async login() {
    this.loading = true;

    const formValue = this.myForm.value;

    const token = await this.authService.login(formValue.email, formValue.password);
    this.logger.log("Result: " + token);
    if (token) {
      this.loading = false;
      this.dismissLogin();
      //FIXME is this how I want this? It needs token to work on first launch.
      this.notificationsService.setupPushForAllPlatforms();

      await this.navCtrl.navigateRoot('/tabs');
    } else {
      this.loading = false;
      this.alertService.presentRedToast("Login failed!");
    }


  }
}
