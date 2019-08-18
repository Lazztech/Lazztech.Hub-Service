import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: ['./people.page.scss'],
})
export class PeoplePage implements OnInit {

  private apollo: Apollo;
  persons: [] = [];

  constructor(apollo: Apollo) {
    this.apollo = apollo;
  }

  ngOnInit() {
    this.apollo.query({
      query: gql`
        query {
          getAllPersons {
            id
            name
            images {
              id
              image
              personDescriptors {
                id
                descriptor
              }
            }
          }
        }
      `
    }).subscribe(({data}) => {
      this.persons = data['getAllPersons'];
      console.log(JSON.stringify(this.persons));
      // console.log(this.persons[0].images[0].image);
    });
  }

}
