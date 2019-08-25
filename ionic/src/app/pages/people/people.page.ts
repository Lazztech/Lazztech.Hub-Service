import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: ['./people.page.scss'],
})
export class PeoplePage implements OnInit {

  loading = false;

  private apollo: Apollo;
  persons: [] = [];

  constructor(
    apollo: Apollo,
    public navCtrl: NavController
  ) {
    this.apollo = apollo;
  }

  ngOnInit() {
    this.loadPeople();
  }

  async loadPeople(){
    this.loading = true;
    const result = await this.apollo.query({
      query: gql`
        query {
          getAllPersons {
            id
            name
            images {
              id
              image
              savedAtTimestamp
              personDescriptors {
                id
                descriptor
              }
            }
          }
        }
      `,
      fetchPolicy: "no-cache"
    }).toPromise();

    this.persons = result.data['getAllPersons'];
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
