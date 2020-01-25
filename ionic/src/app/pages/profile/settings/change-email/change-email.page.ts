import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.page.html',
  styleUrls: ['./change-email.page.scss'],
})
export class ChangeEmailPage implements OnInit {

  loading = false;

  myForm: FormGroup;

  get email() {
    return this.myForm.get('email');
  }

  constructor(
    private modalController: ModalController,
    private profileService: ProfileService,
    private alertService: AlertService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]]
    });

    this.myForm.valueChanges.subscribe();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async changeEmail() {
    this.loading = true;

    const formValue = this.myForm.value;    

    const result = await this.profileService.changeEmail(formValue.email);
    if (result) {
      this.loading = false;
      this.alertService.presentToast("Changed email address.");
      this.dismiss();
    } else {
      this.loading = false;      
      this.alertService.presentRedToast("Failed to change email address.");
    }
  }

}
