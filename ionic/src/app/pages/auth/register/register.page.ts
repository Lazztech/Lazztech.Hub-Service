import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoginPage } from '../login/login.page';
import { Plugins } from '@capacitor/core';
import { environment } from 'src/environments/environment';

const { Browser } = Plugins;

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  loading = false;

  myForm: FormGroup;

  get firstName() {
    return this.myForm.get('firstName');
  }

  get lastName() {
    return this.myForm.get('lastName');
  }

  get email() {
    return this.myForm.get('email');
  }

  get password() {
    return this.myForm.get('password');
  }

  constructor(private modalController: ModalController,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertService: AlertService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      firstName: ['', [
        Validators.required
      ]],
      lastName: ['', [
        Validators.required
      ]],
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

  dismissRegister() {
    this.modalController.dismiss();
  }

  async loginModal() {
    this.dismissRegister();
    const loginModal = await this.modalController.create({
      component: LoginPage,
      swipeToClose: true,
    });
    return await loginModal.present();
  }

  async register() {
    this.loading = true;

    const formValue = this.myForm.value;

    const token = await this.authService.register(formValue.firstName, formValue.lastName, formValue.email, formValue.password);

    if (token) {
      await this.authService.login(formValue.email, formValue.password);
      this.loading = false;
      this.dismissRegister();
      await this.navCtrl.navigateRoot('/tabs');
    } else {
      this.loading = false;
      this.alertService.presentToast('Registration Failed');
    }
  }

  async navigateToPrivacyPolicy() {
    await Browser.open({ url: environment.privacyPolicyLink });
  }

  async navigateToUserAgreement() {
    this.alertService.presentRedToast('User Agreement not implemented yet!');
    throw Error("navigateToUserAgreement User Agreement not implemented yet!");
  }

}
