import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert/alert.service';
import { HubService } from 'src/app/services/hub/hub.service';
import { Observable, Subscription } from 'rxjs';
import { UsersPeopleQuery } from 'src/generated/graphql';
import { NGXLogger } from 'ngx-logger';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.page.html',
  styleUrls: ['./invite.page.scss'],
})
export class InvitePage implements OnInit {

  loading = false;

  myForm: FormGroup;
  id: any;
  persons: Observable<UsersPeopleQuery['usersPeople']>;
  subscriptions: Subscription[] = [];

  get email() {
    return this.myForm.get('email');
  }

  constructor(
    private hubService: HubService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private logger: NGXLogger
  ) { }

  ngOnInit() {
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.myForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]]
    });

    this.persons = this.hubService.watchUsersPeople().valueChanges.pipe(map(x => x.data && x.data.usersPeople));

    this.subscriptions.push(
      this.hubService.watchUsersPeople().valueChanges.subscribe(x => {
        this.logger.log('loading: ', x.loading);
        this.loading = x.loading;
      })
    );
  }


  ngOnDestroy() {
    this.subscriptions.forEach(
      x => x.unsubscribe()
    );
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
