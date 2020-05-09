import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HubService } from 'src/app/services/hub/hub.service';
import { HubQuery, Scalars } from 'src/generated/graphql';

@Component({
  selector: 'app-admin-hub',
  templateUrl: './admin-hub.page.html',
  styleUrls: ['./admin-hub.page.scss'],
})
export class AdminHubPage implements OnInit {

  loading = true;
  userHub: HubQuery['hub'];
  id: Scalars['ID'];

  myForm: FormGroup;

  get hubName() {
    return this.myForm.get('hubName');
  }

  get hubDescription() {
    return this.myForm.get('hubDescription');
  }

  constructor(
    private route: ActivatedRoute,
    private hubService: HubService,
    private fb: FormBuilder
  ) { }

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.userHub = await this.hubService.hub(this.id,
      "network-only"
    );
    this.loading = false;

    this.myForm = this.fb.group({
      hubName: ['', [
        Validators.required,
        Validators.maxLength(25)
      ]],
      hubDescription: ['', [
        Validators.required,
        Validators.maxLength(25)
      ]]
    });
  }

  async save() {
    this.loading = true;
    const formValue = this.myForm.value;
    await this.hubService.editHub(this.id, formValue.hubName, formValue.hubDescription);
    this.loading = false;
  }

  async activeToggle($event) {
    if ($event.detail.checked) {
      await this.hubService.activateHub(this.userHub.hub.id);
    } else {
      await this.hubService.deactivateHub(this.userHub.hub.id);
    }

    // this.active = !this.active;\\
  }

}
