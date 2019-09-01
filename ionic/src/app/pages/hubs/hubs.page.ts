import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-hubs',
  templateUrl: './hubs.page.html',
  styleUrls: ['./hubs.page.scss'],
})
export class HubsPage implements OnInit {

  loading = false;

  ownedHubs: [] = [];

  constructor(
    public navCtrl: NavController,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    // this.loadPeople();
  }

  async doRefresh(event) {
    console.log('Begin async operation');
    this.loading = true;
    // await this.loadPeople();
    event.target.complete();
    this.loading = false;
  }

  goToPersonPage(id: number) {
    this.navCtrl.navigateRoot('hub/'+ id);
  }

  goToAddPersonPage() {
    this.navCtrl.navigateRoot('add-hub');
  }

}
