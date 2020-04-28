import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ResetPinPage } from '../reset-pin/reset-pin.page';
import { Storage } from '@ionic/storage';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit {

  loading = false;

  myForm: FormGroup;

  get resetPin() {
    return this.myForm.get('resetPin');
  }

  get newPassword() {
    return this.myForm.get('newPassword');
  }

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private alertService: AlertService,
    private storage: Storage,
    private fb: FormBuilder
    ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      resetPin: ['', [
        Validators.required
      ]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(10)
      ]]
    });

    this.myForm.valueChanges.subscribe();
  }

  dismissLogin() {
    this.modalController.dismiss();
  }

  async resetPassword() {
    this.loading = true;

    const formValue = this.myForm.value;

    const email = await this.storage.get('resetEmail');
    if (email) {
      const result = await this.authService.resetPassword(
        email,
        formValue.newPassword,
        formValue.resetPin
      );
      if (result) {
        this.loading = false;
        await this.alertService.presentToast("Succeeded.");
        this.dismissLogin();
        const loginModal = await this.modalController.create({
          component: LoginPage
        });
        return await loginModal.present();
      } else {
        this.loading = false;
        this.alertService.presentToast("Password reset failed.");
      }
    } else {
      this.loading = false;
      console.error("Something went wrong.");
    }
  }
  
  async resetPinModal() {
    this.dismissLogin();
    const resetPinModal = await this.modalController.create({
      component: ResetPinPage
    });
    return await resetPinModal.present();
  }

}
