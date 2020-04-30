import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { FetchPolicy } from 'apollo-client';
import { CreateHubGQL, UsersHubsGQL, UsersPeopleGQL, CommonUsersHubsGQL, EditHubGQL, HubGQL, InviteUserToHubGQL, JoinHubGQL, DeleteHubGQL, ChangeHubImageGQL } from 'src/generated/graphql';

@Injectable({
  providedIn: 'root'
})
export class HubService {

  constructor(
    private apollo: Apollo,
    private createHubGQLService: CreateHubGQL,
    private userHubsGQLService: UsersHubsGQL,
    private usersPeopleGQLService: UsersPeopleGQL,
    private commonUsersHubsGQLService: CommonUsersHubsGQL,
    private editHubGQLService: EditHubGQL,
    private hubGQLService: HubGQL,
    private inviteUserToHubGQLService: InviteUserToHubGQL,
    private joinHubGQLService: JoinHubGQL,
    private deleteHubGQLService: DeleteHubGQL,
    private changeHubImageGQLService: ChangeHubImageGQL
  ) { }

  async createHub(name: string, description: string, image: string, latitude: number, longitude: number) {
    const result = await this.createHubGQLService.mutate({
      name,
      description,
      image,
      latitude,
      longitude
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
    const result = await this.userHubsGQLService.fetch(null, {
      fetchPolicy
    }).toPromise();

    const response = result.data.usersHubs;

    if (response) { 
      console.log("usersHubs successful.");
    } else {
      console.log("usersHubs failure");
    }

    return response;
  }

  async usersPeople(fetchPolicy: FetchPolicy = "network-only") {
    const result = await this.usersPeopleGQLService.fetch(null, {
      fetchPolicy
    }).toPromise();

    const response = result.data.usersPeople;

    if (response) { 
      console.log("usersPeople successful.");
    } else {
      console.log("usersPeople failure");
    }

    return response;
  }

  async commonUsersHubs(otherUsersId: number, fetchPolicy: FetchPolicy = "network-only") {
    const result = await this.commonUsersHubsGQLService.fetch({
      otherUsersId
    },
    {
      fetchPolicy
    }).toPromise();

    const response = result.data.commonUsersHubs;

    if (response) { 
      console.log("commonUsersHubs successful.");
    } else {
      console.log("commonUsersHubs failure");
    }

    return response;
  }

  async editHub(hubId: number, name: string, description: string) {
    const result = await this.editHubGQLService.mutate({
      hubId,
      name,
      description
    }).toPromise();

    console.log(result);
    const response = result.data.editHub;

    if (response) {
      console.log("editHub successful.");
    } else {
      console.log("editHub failure");
    }

    return response;
  }

  async hub(id: number, fetchPolicy: FetchPolicy = "network-only") {
    const result = await this.hubGQLService.fetch({
      id
    },
    {
      fetchPolicy
    }).toPromise();

    console.log(result);
    const response = result.data.hub;

    if (response) {
      console.log("got hub successful.");
    } else {
      console.log("hub query failure");
    }

    return response;
  }

  async inviteUserToHub(hubId: number, inviteesEmail: string) {
    const result = await this.inviteUserToHubGQLService.mutate({
      hubId,
      inviteesEmail
    }).toPromise();

    console.log(result);
    const response = result.data.inviteUserToHub;
    return response;
  }

  async joinHub(id: number): Promise<boolean> {
    const result = await this.joinHubGQLService.mutate({
      id
    }).toPromise();
    
    console.log(result);
    const response = result.data.joinHub;
    return response;
  }

  async deleteHub(id: number): Promise<boolean> {
    const result = await this.deleteHubGQLService.mutate({
      id
    }).toPromise();

    console.log(result);
    const response = result.data.deleteHub;
    return response;
  }

  async changeHubImage(id: number, image: string): Promise<boolean> {
    const result = await this.changeHubImageGQLService.mutate({
      id,
      image
    }).toPromise();

    console.log(result);
    const response = result.data.changeHubImage;
    return (response)? true : false;
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
    const response = (result as any).data.setHubStarred;
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
    const response = (result as any).data.setHubNotStarred;
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

  async activateHub(hubId: number) {
    const result = await this.apollo.mutate({
      mutation: gql`
      mutation {
        activateHub(hubId: ${hubId}) {
          id
          active
        }
      }
      `
    }).toPromise();
    
    console.log(`exitedHubGeofence hubId ${hubId} returned ${result}`);
    return result;
  }

  async deactivateHub(hubId: number) {
    const result = await this.apollo.mutate({
      mutation: gql`
      mutation {
        deactivateHub(hubId: ${hubId}) {
          id
          active
        }
      }
      `
    }).toPromise();
    
    console.log(`exitedHubGeofence hubId ${hubId} returned ${result}`);
    return result;
  }

  async sendMicroChat(hubId: number, microChatId) {
    const result = await this.apollo.mutate({
      mutation: gql`
      mutation {
        microChatToHub(hubId: ${hubId}, microChatId: ${microChatId})
      }
      `
    }).toPromise();
    const response = (result as any).data.setHubStarred;
    return response;
  }

  async createMicroChat(hubId: number, microChatText: string) {
    const result = await this.apollo.mutate({
      mutation: gql`
      mutation {
        createMicroChat(hubId: ${hubId}, microChatText: "${microChatText}") {
          id
          text
        }
      }
      `
    }).toPromise();
    return result;
  }

  async deleteMicroChat(hubId: number, microChatId: number) {
    const result = await this.apollo.mutate({
      mutation: gql`
      mutation {
        deleteMicroChat(hubId: ${hubId}, microChatId: ${microChatId})
      }
      `
    }).toPromise();
    return result;
  }
}
