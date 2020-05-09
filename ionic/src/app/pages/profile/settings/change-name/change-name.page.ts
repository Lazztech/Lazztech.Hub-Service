import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-name',
  templateUrl: './change-name.page.html',
  styleUrls: ['./change-name.page.scss'],
})
export class ChangeNamePage implements OnInit {

  loading = false;

  myForm: FormGroup;

  get firstName() {
    return this.myForm.get('firstName');
  }

  get lastName() {
    return this.myForm.get('lastName');
  }

  get description() {
    return this.myForm.get('description');
  }

  constructor(
    private modalController: ModalController,
    private profileService: ProfileService,
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
      description: ['', [
        // Validators.required
      ]]
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async changeName() {
    this.loading = true;

    const formValue = this.myForm.value;

    const result = await this.profileService.editUserDetails(formValue.firstName, formValue.lastName, formValue.description);
    if (result) {
      this.loading = false;
      this.alertService.presentToast("Changed name.");
      this.dismiss();
    } else {
      this.loading = false;
      this.alertService.presentRedToast("Failed to change name.");
    }
  }

}
