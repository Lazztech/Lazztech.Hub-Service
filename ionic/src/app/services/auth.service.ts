import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  token:any;

  constructor(
    private apollo: Apollo,
    private storage: Storage
  ) { }

  async login(email: string, password: string): Promise<boolean> {
    const result = await this.apollo.mutate({
      mutation: gql`
        mutation {
          login(password: "${password}", email: "${email}")
        }
      `
    }).toPromise();

    console.log(result);
    this.token = result.data.login;

    if (this.token) {
      console.log("Login successful.");
      await this.storage.set('token', this.token);
      this.isLoggedIn = true;
    } else {
      console.log("Login failure");
    }

    return this.token;
  }

  async logout() {
    await this.storage.remove("token");
    this.isLoggedIn = false;
    delete this.token;
  }

  async register(firstName: string, lastName: string, email: string, password: string): Promise<boolean> {
    const result = await this.apollo.mutate({
      mutation: gql`
        mutation {
          register(data: {
            firstName: "${firstName}",
            lastName: "${lastName}",
            email: "${email}",
            password: "${password}"
          })
        }
      `
    }).toPromise();

    console.log(result);
    this.token = result.data.register;
    return this.token;
  }

  async sendReset(email: string): Promise<boolean> {
    const result = await this.apollo.mutate({
      mutation: gql`
        mutation {
          sendPasswordResetEmail(email: "${email}")
        }
      `
    }).toPromise();

    console.log(result);
    return result.data.sendPasswordResetEmail;
  }

  async resetPassword(email: string, newPassword: string, resetPin: string): Promise<boolean> {
    const result = await this.apollo.mutate({
      mutation: gql`
        mutation {
          resetPassword(
            usersEmail: "${email}",
            newPassword: "${newPassword}",
            resetPin: "${resetPin}"
          )
        }
      `
    }).toPromise();

    console.log(result);
    return result.data.resetPassword;
  }

  async user(): Promise<User> {
    const result = await this.apollo.query({
      query: gql`
        query {
          me { 
            id
            firstName
            lastName
            email
          }
        }
      `
    }).toPromise();

    console.log(result);

    return result.data['me'];
  }

  async verifyAccountExists(): Promise<boolean> {
    try {
      const result = await this.apollo.query({
        query: gql`
          query {
            me { 
              id
              firstName
              lastName
              email
            }
          }
        `,
        fetchPolicy: "network-only"
      }).toPromise();

      if (result.data['me']) {
        return true;
      } else {

        return false;
      }
    } catch (error) {
     return false; 
    }
  }

  async getToken(): Promise<string> {
    try {
      this.token = await this.storage.get('token')

      if(this.token != null) {
        this.isLoggedIn=true;
      } else {
        this.isLoggedIn=false;
      }

      return this.token;
    } catch (error) {
      this.token = null;
      this.isLoggedIn=false;
    }
  }
}
