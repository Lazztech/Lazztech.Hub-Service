import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private apollo: Apollo,
    private storage: Storage
  ) { }

  async changeName(firstName: string, lastName: string): Promise<boolean> {
    const result = await this.apollo.mutate({
      mutation: gql`
        mutation {
          changeName(firstName: "${firstName}", lastName: "${lastName}") {
            id
            firstName
            lastName
          }
        }
      `
    }).toPromise();

    console.log(result);
    if ((result as any).data.changeName) {
      console.log("Changed name successfully.");
      return true;
    } else {
      console.log("Failed to change name.");
      return false;
    }
  }
  
  async changeEmail(newEmail: string): Promise<boolean> {
    const result = await this.apollo.mutate({
      mutation: gql`
        mutation {
          changeEmail(newEmail: "${newEmail}") {
            id
            email
          }
        }
      `
    }).toPromise();

    console.log(result);
    if ((result as any).data.changeEmail) {
      console.log("Changed email successfully");
      return true;
    } else {
      console.log("Failed to change name.");
      return false;
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<boolean> {
    const result = await this.apollo.mutate({
      mutation: gql`
        mutation {
          changePassword(oldPassword: "${oldPassword}", newPassword: "${newPassword}")
        }
      `
    }).toPromise();

    console.log(result);
    if ((result as any).data.changePassword) {
      console.log("Changed password successfully");
      return true;
    } else {
      console.log("Failed to change password.");
      return false;
    }
  }

  async changeUserImage(image: string): Promise<any> {
    const result = await this.apollo.mutate({
      mutation: gql`
      mutation {
        changeUserImage(newImage: "${image}") {
          image
        }
      }
      `
    }).toPromise();

    console.log(result);
    const response = (result as any).data.changeUserImage;
    return response;
  }

  async deleteAccount(emailAddress: string, password: string) {
    const result = await this.apollo.mutate({
      mutation: gql`
        mutation {
          deleteAccount(email: "${emailAddress}", password: "${password}")
        }
      `
    }).toPromise();

    console.log(result);
    if ((result as any).data.deleteAccount) {
      console.log("Deleted account successfully");
      return true;
    } else {
      console.log("Failed to delete account.");
      return false;
    }
  }

  async inviteUser(emailAddress: string) {
    const result = await this.apollo.mutate({
      mutation: gql`
        mutation {
          newInvite(email: "${emailAddress}")
        }
      `
    }).toPromise();

    console.log(result);
    if ((result as any).data.newInvite) {
      console.log("Invite sent!");
      return true;
    } else {
      console.log("Failed.");
      return false;
    }
  }

  async clearStorage() {
    await this.storage.clear();
    console.log('cleared storage');
    document.location.reload();
    // IDK Which is better? But the line above works.
    // window.location.reload();
  }
}
