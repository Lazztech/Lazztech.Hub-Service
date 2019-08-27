import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { NavController } from '@ionic/angular';
import { PeopleService } from 'src/app/services/people.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: ['./people.page.scss'],
})
export class PeoplePage implements OnInit {

  loading = false;

  persons: [] = [];

  constructor(
    private apollo: Apollo,
    public navCtrl: NavController,
    private peopleService: PeopleService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.loadPeople();
  }

  async loadPeople(){
    this.loading = true;
    this.persons = await this.peopleService.loadAllPeople();
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

  goToAddPersonPage() {
    this.navCtrl.navigateRoot('add-person');
  }

}
