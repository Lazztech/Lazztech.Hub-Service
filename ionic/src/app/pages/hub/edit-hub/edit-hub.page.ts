import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { HubService } from 'src/app/services/hub.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-edit-hub',
  templateUrl: './edit-hub.page.html',
  styleUrls: ['./edit-hub.page.scss'],
})
export class EditHubPage implements OnInit {

  loading = false;
  id: number;
  userHub: any;

  myForm: FormGroup;

  get hubName() {
    return this.myForm.get('hubName');
  }

  get hubDescription() {
    return this.myForm.get('hubDescription');
  }

  constructor(
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private hubService: HubService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.id = parseInt(this.route.snapshot.paramMap.get('id'));

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

    this.myForm.valueChanges.subscribe();
  }

  async ionViewDidEnter() {
    this.loading = true;
    this.userHub = await this.hubService.hub(this.id);
    this.loading = false;
  }

  async save() {
    this.loading = true;
    const formValue = this.myForm.value;
    await this.hubService.editHub(this.id, formValue.hubName, formValue.hubDescription);
    this.loading = false;
    await this.navCtrl.back();
  }

}
