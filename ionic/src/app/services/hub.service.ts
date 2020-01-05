import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { FetchPolicy } from 'apollo-client';

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

  async usersHubs(fetchPolicy: FetchPolicy = "network-only") {
    const result = await this.apollo.query({
      query: gql`
      query {
        usersHubs{
          userId
          hubId
          isOwner
          starred
          isPresent
          hub {
            id
            name
            image
            latitude
            longitude
          }
        }
      }
      `,
      fetchPolicy
    }).toPromise();

    const response = result.data["usersHubs"];

    if (response) { 
      console.log("usersHubs successful.");
    } else {
      console.log("usersHubs failure");
    }

    return response;
  }

  async renameHub(hubId: number, newName: string) {
    const result = await this.apollo.mutate({
      mutation: gql`
      mutation {
        renameHub(hubId: ${hubId}, newName: "${newName}") {
          name
        }
      }
      `,
      // fetchPolicy
    }).toPromise();

    console.log(result);
    const response = result.data.renameHub;

    if (response) {
      console.log("renameHub successful.");
    } else {
      console.log("renameHub failure");
    }

    return response;
  }

  async hub(id: number, fetchPolicy: FetchPolicy = "network-only") {
    const result = await this.apollo.query({
      query: gql`
      query {
        hub(id: ${id}) {
          userId
          hubId
          isOwner
          starred
          isPresent
          hub {
            id
            name
            image
            latitude
            longitude
          }
        }
      }
      `,
      fetchPolicy
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

  async getHubByQRImage(qrImageB64: string, fetchPolicy: FetchPolicy = "network-only"): Promise<boolean> {
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
      fetchPolicy
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

  async enteredHubGeofence(hubId: number) {
    const result = await this.apollo.mutate({
      mutation: gql`
      mutation {
        enteredHubGeofence(hubId: ${hubId})
      }
      `
    }).toPromise();
    
    console.log(`enteredHubGeofence hubId ${hubId} returned ${result}`);
    return result;
  }

  async exitedHubGeofence(hubId: number) {
    const result = await this.apollo.mutate({
      mutation: gql`
      mutation {
        exitedHubGeofence(hubId: ${hubId})
      }
      `
    }).toPromise();
    
    console.log(`exitedHubGeofence hubId ${hubId} returned ${result}`);
    return result;
  }
}
