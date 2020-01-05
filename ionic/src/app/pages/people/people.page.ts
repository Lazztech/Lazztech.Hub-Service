import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: ['./people.page.scss'],
})
export class PeoplePage implements OnInit {

  loading = false;

  persons: [] = [];

  constructor(
    public navCtrl: NavController,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.loadPeople();
  }

  async loadPeople(){
    this.loading = true;
    // this.persons = await this.peopleService.loadAllPeople();
    this.loading = false;
  }

  async doRefresh(event) {
    console.log('Begin async operation');
    this.loading = true;
    await this.loadPeople();
    event.target.complete();
  }

  goToPersonPage(id: number) {
    this.navCtrl.navigateRoot('person/'+ id);
  }

}
