import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterPage } from '../register/register.page';
import { ResetPinPage } from '../reset-pin/reset-pin.page';

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
    private fb: FormBuilder
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

    this.myForm.valueChanges.subscribe();
  }

  dismissLogin() {
    this.modalController.dismiss();
  }

  async registerModal() {
    this.dismissLogin();
    const registerModal = await this.modalController.create({
      component: RegisterPage
    });
    return await registerModal.present();
  }

  async resetModal() {
    this.dismissLogin();
    const resetModal = await this.modalController.create({
      component: ResetPinPage
    });
    return await resetModal.present();
  }

  async login() {
    this.loading = true;

    const formValue = this.myForm.value;

    const token = await this.authService.login(formValue.email, formValue.password);
    console.log("Result: " + token);
    if (token) {
      this.loading = false;
      this.dismissLogin();
      await this.navCtrl.navigateRoot('/home');
    } else {
      this.loading = false;
      this.alertService.presentRedToast("Login failed!");
    }


  }
}
