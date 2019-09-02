import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ProfileService } from 'src/app/services/profile.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-create-hub',
  templateUrl: './create-hub.page.html',
  styleUrls: ['./create-hub.page.scss'],
})
export class CreateHubPage implements OnInit {

  photo: any;

  loading = false;

  myForm: FormGroup;

  get hubName() {
    return this.myForm.get('hubName');
  }

  constructor(
    private profileService: ProfileService,
    private alertService: AlertService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      hubName: ['', [
        Validators.required
      ]]
    });

    this.myForm.valueChanges.subscribe();
  }

  async saveHub() {
    this.loading = true;

    const formValue = this.myForm.value;

    const result = await this.profileService.changeName(formValue.hubName, formValue.lastName);
    if (result) {
      this.loading = false;
      this.alertService.presentToast("Changed name.");
    } else {
      this.loading = false;
      this.alertService.presentRedToast("Failed to change name.");
    }
  }

}
