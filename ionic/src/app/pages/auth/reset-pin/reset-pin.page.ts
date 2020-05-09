import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { PasswordResetPage } from '../password-reset/password-reset.page';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-reset-pin',
  templateUrl: './reset-pin.page.html',
  styleUrls: ['./reset-pin.page.scss'],
})
export class ResetPinPage implements OnInit {

  loading = false;

  myForm: FormGroup;

  get email() {
    return this.myForm.get('email');
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
      email: ['', [
        Validators.required,
        Validators.email
      ]]
    });
  }

  dismissLogin() {
    this.modalController.dismiss();
  }

  async sendPin() {
    this.loading = true;

    const formValue = this.myForm.value;

    const result = await this.authService.sendReset(formValue.email);
    if (result) {
      await this.storage.set('resetEmail', formValue.email);
      this.loading = false;
      await this.alertService.presentToast("Email sent.");
      this.dismissLogin();
      const resetModal = await this.modalController.create({
        component: PasswordResetPage
      });
      return await resetModal.present();
    } else {
      this.loading = false;
      this.alertService.presentRedToast("Email failed to send.");
    }
  }

}
