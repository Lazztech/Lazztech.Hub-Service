import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { ProfileService } from 'src/app/services/profile.service';
import { NgForm, FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  loading = false;

  myForm: FormGroup;

  get oldPassword() {
    return this.myForm.get('oldPassword');
  }

  get newPassword() {
    return this.myForm.get('newPassword');
  }

  constructor(
    private modalController: ModalController,
    private profileService: ProfileService,
    private alertService: AlertService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      oldPassword: ['', [
        Validators.required
      ]],
      newPassword: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(8)
      ]]
    });

    this.myForm.valueChanges.subscribe();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async changePassword() {
    this.loading = true;

    const formValue = this.myForm.value;

    const result = await this.profileService.changePassword(formValue.oldPassword, formValue.newPassword);
    if (result) {
      this.loading = false;
      this.alertService.presentToast("Changed password.");
      this.dismiss();
    } else {
      this.loading = false;
      this.alertService.presentRedToast("Failed to change password.");
    }
  }

}
