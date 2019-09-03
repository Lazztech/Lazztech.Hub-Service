import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class HubService {

  constructor(
    private apollo: Apollo,
  ) { }

  async createHub(name: string, image: string) {
    const result = await this.apollo.mutate({
      mutation: gql`
      mutation {
        createHub(image: "${image}", name: "${name}") {
          id
          name
          image
        }
      }
      `
    }).toPromise();

    console.log(result);
    const response = result.data.createHub;

    if (response) {
      console.log("createHub successful.");
    } else {
      console.log("createHub failure");
    }

    return response;
  }

  async ownedHubs() {
    const result = await this.apollo.query({
      query: gql`
      query {
        ownedHubs {
          id
          name
          image
          owners {
            id
            firstName
            lastName
            email
          }
          members {
            id
            firstName
            lastName
            email
          }
        }
      }
      `
    }).toPromise();

    console.log(result);
    const response = result.data["ownedHubs"];

    if (response) {
      console.log("createHub successful.");
    } else {
      console.log("createHub failure");
    }

    return response;
  }

  async memberOfHubs() {
    const result = await this.apollo.query({
      query: gql`
      query {
        memberOfHubs {
          id
          name
          image
          owners {
            id
            firstName
            lastName
            email
          }
          members {
            id
            firstName
            lastName
            email
          }
        }
      }
      `
    }).toPromise();

    console.log(result);
    const response = result.data["ownedHubs"];

    if (response) {
      console.log("createHub successful.");
    } else {
      console.log("createHub failure");
    }

    return response;
  }
}
