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

  async createHub(name: string, image: string, latitude: number, longitude: number) {
    const result = await this.apollo.mutate({
      mutation: gql`
      mutation {
        createHub(image: "${image}", name: "${name}", latitude: ${latitude}, longitude: ${longitude}) {
          id
          name
          image
          latitude
          longitude
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
      `,
      fetchPolicy: "network-only"
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
      `,
      fetchPolicy: "network-only"
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

  async starredHubs() {
    const result = await this.apollo.query({
      query: gql`
      query {
        starredHubs {
          id
          name
          image
          starred
          latitude
          longitude
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
      `,
      fetchPolicy: "network-only"
    }).toPromise();

    console.log(result);
    const response = result.data["starredHubs"];

    if (response) {
      console.log("createHub successful.");
    } else {
      console.log("createHub failure");
    }

    return response;
  }

  async hub(id: number) {
    const result = await this.apollo.query({
      query: gql`
      query {
        hub(id: ${id}) {
          id
          name
          image
          starred
          latitude
          longitude
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
      `,
      fetchPolicy: "network-only"
    }).toPromise();

    console.log(result);
    const response = result.data["hub"];

    if (response) {
      console.log("got hub successful.");
    } else {
      console.log("hub query failure");
    }

    return response;
  }

  async getHubByQRImage(qrImageB64: string): Promise<boolean> {
    const result = await this.apollo.query({
      query: gql`
      query {
        getHubByQRImage(qrImageB64: "${qrImageB64}") {
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
      `,
      fetchPolicy: "network-only"
    }).toPromise();

    console.log(result);
    const response = result.data["getHubByQRImage"];
    if (response) {
      console.log("got hub successful.");
    } else {
      console.log("hub query failure");
    }

    return response;
  }

  async joinHub(id: number): Promise<boolean> {
    const result = await this.apollo.mutate({
      mutation: gql`
      mutation {
        joinHub(id: ${id})
      }
      `
    }).toPromise();

    console.log(result);
    const response = result.data.joinHub;
    return response;
  }

  async deleteHub(id: number): Promise<boolean> {
    const result = await this.apollo.mutate({
      mutation: gql`
      mutation {
        deleteHub(hubId: ${id})
      }
      `
    }).toPromise();

    console.log(result);
    const response = result.data.deleteHub;
    return response;
  }

  async updateHubPhoto(id: number, image: string): Promise<boolean> {
    const result = await this.apollo.mutate({
      mutation: gql`
      mutation {
        updateHubPhoto(id: ${id}, image: "${image}")
      }
      `
    }).toPromise();

    console.log(result);
    const response = result.data.updateHubPhoto;
    return response;
  }

  async setHubStarred(hubId: number) {
    const result = await this.apollo.mutate({
      mutation: gql`
      mutation {
        setHubStarred(hubId: ${hubId})
      }
      `
    }).toPromise();

    console.log(result);
    const response = result.data.setHubStarred;
    return response;
  }

  async setHubNotStarred(hubId: number) {
    const result = await this.apollo.mutate({
      mutation: gql`
      mutation {
        setHubNotStarred(hubId: ${hubId})
      }
      `
    }).toPromise();

    console.log(result);
    const response = result.data.setHubNotStarred;
    return response;
  }
}
