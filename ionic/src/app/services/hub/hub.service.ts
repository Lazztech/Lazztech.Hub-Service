import { Injectable } from '@angular/core';
import { FetchPolicy } from 'apollo-client';
import { CreateHubGQL, UsersHubsGQL, UsersPeopleGQL, CommonUsersHubsGQL, EditHubGQL, HubGQL, InviteUserToHubGQL, JoinHubGQL, DeleteHubGQL, ChangeHubImageGQL, SetHubStarredGQL, SetHubNotStarredGQL, EnteredHubGeofenceGQL, ExitedHubGeofenceGQL, ActivateHubGQL, DeactivateHubGQL, MicroChatToHubGQL, CreateMicroChatGQL, DeleteMicroChatGQL, Scalars, CreateMicroChatDocument, HubDocument, HubQueryVariables, HubQuery, UsersHubsDocument, UsersHubsQuery, UsersHubsQueryVariables } from 'src/generated/graphql';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class HubService {

  constructor(
    private logger: NGXLogger,
    private createHubGQLService: CreateHubGQL,
    private userHubsGQLService: UsersHubsGQL,
    private usersPeopleGQLService: UsersPeopleGQL,
    private commonUsersHubsGQLService: CommonUsersHubsGQL,
    private editHubGQLService: EditHubGQL,
    private hubGQLService: HubGQL,
    private inviteUserToHubGQLService: InviteUserToHubGQL,
    private joinHubGQLService: JoinHubGQL,
    private deleteHubGQLService: DeleteHubGQL,
    private changeHubImageGQLService: ChangeHubImageGQL,
    private setHubStarredGQLService: SetHubStarredGQL,
    private setHubNotStarredGQLService: SetHubNotStarredGQL,
    private enteredHubGeofenceGQLService: EnteredHubGeofenceGQL,
    private exitedHubGeofenceGQLService: ExitedHubGeofenceGQL,
    private activateHubGQLService: ActivateHubGQL,
    private deactivateHubGQLService: DeactivateHubGQL,
    private microChatToHubGQLService: MicroChatToHubGQL,
    private createMicroChatGQLService: CreateMicroChatGQL,
    private deleteMicroChatGQLService: DeleteMicroChatGQL
  ) { }

  async createHub(name: string, description: string, image: string, latitude: number, longitude: number) {
    const result = await this.createHubGQLService.mutate({
      name,
      description,
      image,
      latitude,
      longitude
    }, {
      update: (proxy, { data: { createHub }}) => {
        // Read the data from our cache for this query.
        const data = proxy.readQuery({ 
          query: UsersHubsDocument,
        }) as UsersHubsQuery;

        //Add new hub to userHubs array
        data.usersHubs.push(createHub);

        // Write our data back to the cache.
        proxy.writeQuery({ 
          query: UsersHubsDocument,
          data 
        });
      }
    }).toPromise();

    const response = result.data.createHub;

    if (response) {
      this.logger.log("createHub successful.");
    } else {
      this.logger.log("createHub failure");
    }

    return response;
  }

  async usersHubs(fetchPolicy: FetchPolicy = "network-only") {
    const result = await this.userHubsGQLService.fetch(null, {
      fetchPolicy
    }).toPromise();

    const response = result.data.usersHubs;

    if (response) {
      this.logger.log("usersHubs successful.");
    } else {
      this.logger.log("usersHubs failure");
    }

    return response;
  }
  
  watchUserHubs(fetchPolicy: FetchPolicy = "cache-first") {
    return this.userHubsGQLService.watch(null, {
      fetchPolicy
    });
  }

  watchUsersPeople(fetchPolicy: FetchPolicy = "cache-first") {
    return this.usersPeopleGQLService.watch(null, {
      fetchPolicy
    });
  }

  async usersPeople(fetchPolicy: FetchPolicy = "network-only") {
    const result = await this.usersPeopleGQLService.fetch(null, {
      fetchPolicy
    }).toPromise();

    const response = result.data.usersPeople;

    if (response) {
      this.logger.log("usersPeople successful.");
    } else {
      this.logger.log("usersPeople failure");
    }

    return response;
  }

  async commonUsersHubs(otherUsersId: Scalars['ID'], fetchPolicy: FetchPolicy = "network-only") {
    const result = await this.commonUsersHubsGQLService.fetch({
      otherUsersId
    },
      {
        fetchPolicy
      }).toPromise();

    const response = result.data.commonUsersHubs;

    if (response) {
      this.logger.log("commonUsersHubs successful.");
    } else {
      this.logger.log("commonUsersHubs failure");
    }

    return response;
  }

  async editHub(hubId: Scalars['ID'], name: string, description: string) {
    const result = await this.editHubGQLService.mutate({
      hubId,
      name,
      description
    }).toPromise();

    const response = result.data.editHub;

    if (response) {
      this.logger.log("editHub successful.");
    } else {
      this.logger.log("editHub failure");
    }

    return response;
  }

  async hub(id: Scalars['ID'], fetchPolicy: FetchPolicy = "cache-first") {
    const result = await this.hubGQLService.fetch({
      id
    },
      {
        fetchPolicy
      }).toPromise();

    const response = result.data.hub;

    if (response) {
      this.logger.log("got hub successful.");
    } else {
      this.logger.log("hub query failure");
    }

    return response;
  }

  watchHub(id: Scalars['ID'], fetchPolicy: FetchPolicy = "cache-first") {
    return this.hubGQLService.watch({
      id
    },
    {
      fetchPolicy
    });
  }

  async inviteUserToHub(hubId: Scalars['ID'], inviteesEmail: string) {
    const result = await this.inviteUserToHubGQLService.mutate({
      hubId,
      inviteesEmail
    }).toPromise();

    const response = result.data.inviteUserToHub;
    return response;
  }

  async joinHub(id: Scalars['ID']): Promise<boolean> {
    const result = await this.joinHubGQLService.mutate({
      id
    }).toPromise();

    const response = result.data.joinHub;
    return response;
  }

  async deleteHub(id: Scalars['ID']): Promise<boolean> {
    const result = await this.deleteHubGQLService.mutate({
      id
    }, {
      update: (proxy, { data: { deleteHub }}) => {
        // Read the data from our cache for this query.
        const hubQueryData = proxy.readQuery({ 
          query: HubDocument,
         variables:  { id } as HubQueryVariables
        }) as HubQuery;

        //Delete hub
        delete hubQueryData.hub

        // Write our data back to the cache.
        proxy.writeQuery({ 
          query: HubDocument,
          variables: { id: id } as HubQueryVariables,
          data: hubQueryData 
        });

        //TODO would it be more robust to recurse through the RootQuery document tree and delete that way?
        const userHubsData = proxy.readQuery({
          query: UsersHubsDocument
        }) as UsersHubsQuery;

        //Delete Hub
        const userHub = userHubsData.usersHubs.find(x => x.hubId == id);
        userHubsData.usersHubs.splice(
          userHubsData.usersHubs.indexOf(userHub), 1
        );

        proxy.writeQuery({
          query: UsersHubsDocument,
          data: userHubsData
        });
      }
    }).toPromise();

    const response = result.data.deleteHub;
    return response;
  }

  async changeHubImage(id: Scalars['ID'], image: string): Promise<boolean> {
    const result = await this.changeHubImageGQLService.mutate({
      id,
      image
    }).toPromise();

    const response = result.data.changeHubImage;
    return (response) ? true : false;
  }

  async setHubStarred(hubId: Scalars['ID']) {
    const result = await this.setHubStarredGQLService.mutate({
      hubId
    }).toPromise();

    const response = result.data.setHubStarred;
    return response;
  }

  async setHubNotStarred(hubId: Scalars['ID']) {
    const result = await this.setHubNotStarredGQLService.mutate({
      hubId
    }).toPromise();

    const response = result.data.setHubNotStarred;
    return response;
  }

  async enteredHubGeofence(hubId: Scalars['ID']) {
    const result = await this.enteredHubGeofenceGQLService.mutate({
      hubId
    }).toPromise();

    this.logger.log(`enteredHubGeofence hubId ${hubId} returned ${result}`);
    return result;
  }

  async exitedHubGeofence(hubId: Scalars['ID']) {
    const result = await this.exitedHubGeofenceGQLService.mutate({
      hubId
    }).toPromise();

    this.logger.log(`exitedHubGeofence hubId ${hubId} returned ${result}`);
    return result;
  }

  async activateHub(hubId: Scalars['ID']) {
    const result = await this.activateHubGQLService.mutate({
      hubId
    }).toPromise();
    return result;
  }

  async deactivateHub(hubId: Scalars['ID']) {
    const result = await this.deactivateHubGQLService.mutate({
      hubId
    }).toPromise();

    return result;
  }

  async sendMicroChat(hubId: Scalars['ID'], microChatId: Scalars['ID']) {
    const result = await this.microChatToHubGQLService.mutate({
      hubId,
      microChatId
    }).toPromise();

    const response = result.data.microChatToHub;
    return response;
  }

  async createMicroChat(hubId: Scalars['ID'], microChatText: string) {
    const result = await this.createMicroChatGQLService.mutate({
      hubId,
      microChatText
    },
    {
      update: (proxy, { data: { createMicroChat }}) => {
        // Read the data from our cache for this query.
        const data = proxy.readQuery({ 
          query: HubDocument,
         variables:  { id: hubId } as HubQueryVariables
        }) as HubQuery;

        //Add new micro-chat to hub's array of micro-chats
        data.hub.hub.microChats.push(createMicroChat);

        // Write our data back to the cache.
        proxy.writeQuery({ 
          query: HubDocument,
          variables: { id: hubId } as HubQueryVariables,
          data 
        });
      }
    }).toPromise();
    return result.data.createMicroChat;
  }

  async deleteMicroChat(hubId: Scalars['ID'], microChatId: Scalars['ID']) {
    const result = await this.deleteMicroChatGQLService.mutate({
      hubId,
      microChatId
    },
    {
      update: (proxy, { data: { deleteMicroChat }}) => {
        // Read the data from our cache for this query.
        const data = proxy.readQuery({ 
          query: HubDocument,
         variables:  { id: hubId } as HubQueryVariables
        }) as HubQuery;

        //Remove micro-chat from hub's array of micro-chats
        const microChat = data.hub.hub.microChats.find(x => x.id == microChatId);
        data.hub.hub.microChats.splice(
          data.hub.hub.microChats.indexOf(microChat), 1
        );

        // Write our data back to the cache.
        proxy.writeQuery({ 
          query: HubDocument,
          variables: { id: hubId } as HubQueryVariables,
          data 
        });
      }
    }).toPromise();
    return result.data.deleteMicroChat;
  }
}
