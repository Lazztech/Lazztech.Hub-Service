import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HubService } from 'src/app/services/hub.service';

@Component({
  selector: 'app-hubs',
  templateUrl: './hubs.page.html',
  styleUrls: ['./hubs.page.scss'],
})
export class HubsPage implements OnInit {

  loading = false;

  ownedHubs: [] = [];
  memberOfHubs: [] = [];


  constructor(
    public navCtrl: NavController,
    public hubService: HubService
  ) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    this.loading = true;
    await this.loadOwnedHubs();
    await this.loadMemberOfHubs();
    this.loading = false;
  }

  async doRefresh(event) {
    console.log('Begin async operation');
    this.loading = true;
    await this.loadOwnedHubs();
    await this.loadMemberOfHubs();
    this.loading = false;
    event.target.complete();
  }

  async loadOwnedHubs() {
    this.ownedHubs = await this.hubService.ownedHubs();
  }

  async loadMemberOfHubs() {
    this.memberOfHubs = await this.hubService.memberOfHubs();
  }

  goToPersonPage(id: number) {
    this.navCtrl.navigateRoot('hub/'+ id);
  }

  goToAddPersonPage() {
    this.navCtrl.navigateRoot('add-hub/join-hub');
  }

}
