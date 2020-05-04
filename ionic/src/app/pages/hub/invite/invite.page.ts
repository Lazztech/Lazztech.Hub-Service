import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert/alert.service';
import { HubService } from 'src/app/services/hub/hub.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.page.html',
  styleUrls: ['./invite.page.scss'],
})
export class InvitePage implements OnInit {

  loading = false;

  myForm: FormGroup;
  id: any;

  get email() {
    return this.myForm.get('email');
  }

  constructor(
    private hubService: HubService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
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

    const result = await this.hubService.inviteUserToHub(this.id, formValue.email);
    if (result) {
      this.loading = false;
      this.alertService.presentToast("Invited!");
    } else {
      this.loading = false;      
      this.alertService.presentRedToast("Failed.");
    }
  }
}
