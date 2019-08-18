import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.page.html',
  styleUrls: ['./invite.page.scss'],
})
export class InvitePage implements OnInit {

  loading = false;

  myForm: FormGroup;

  get email() {
    return this.myForm.get('email');
  }

  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder,
    private alertService: AlertService
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

  async inviteUser() {
    this.loading = true;

    const formValue = this.myForm.value;    

    const result = await this.profileService.inviteUser(formValue.email);
    if (result) {
      this.loading = false;
      this.alertService.presentToast("Invite sent!");
    } else {
      this.loading = false;      
      this.alertService.presentRedToast("Failed.");
    }
  }
}
