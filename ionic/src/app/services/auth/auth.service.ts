import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NGXLogger } from 'ngx-logger';
import { LoginGQL, MeGQL, RegisterGQL, ResetPasswordGQL, SendPasswordResetEmailGQL, User } from 'src/generated/graphql';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  token: any;

  constructor(
    private storage: Storage,
    private loginService: LoginGQL,
    private registerService: RegisterGQL,
    private sendPasswordResetEmailService: SendPasswordResetEmailGQL,
    private resetPasswordService: ResetPasswordGQL,
    private meService: MeGQL,
    private logger: NGXLogger
  ) { }

  async login(email: string, password: string): Promise<boolean> {
    const result = await this.loginService.mutate({
      email,
      password
    }).toPromise();

    this.logger.log(result);
    this.token = result.data.login;

    if (this.token) {
      this.logger.log("Login successful.");
      await this.storage.set('token', this.token);
      this.isLoggedIn = true;
    } else {
      this.logger.log("Login failure");
    }

    return this.token;
  }

  async logout() {
    await this.storage.remove("token");
    this.isLoggedIn = false;
    delete this.token;
  }

  async register(firstName: string, lastName: string, email: string, password: string): Promise<boolean> {
    const result = await this.registerService.mutate({
      firstName,
      lastName,
      email,
      password
    }).toPromise();

    this.logger.log(result);
    this.token = result.data.register;
    return this.token;
  }

  async sendReset(email: string): Promise<boolean> {
    const result = await this.sendPasswordResetEmailService.mutate({
      email
    }).toPromise();

    this.logger.log(result);
    return result.data.sendPasswordResetEmail;
  }

  async resetPassword(email: string, newPassword: string, resetPin: string): Promise<boolean> {
    const result = await this.resetPasswordService.mutate({
      email,
      newPassword,
      resetPin
    }).toPromise();

    this.logger.log(result);
    return result.data.resetPassword;
  }

  async user(): Promise<User> {
    const result = await this.meService.fetch().toPromise();
    this.logger.log(result);
    return result.data.me;
  }

  async verifyAccountExists(): Promise<boolean> {
    try {
      const result = await this.meService.fetch(null, {
        fetchPolicy: "network-only"
      }).toPromise();

      if (result.errors) {
        // code: "INTERNAL_SERVER_ERROR"
        //FIXME: this may break on a different deployment platform
        if (result.errors[0].name == "INTERNAL_SERVER_ERROR") {
          for (let index = 0; index < 3; index++) {
            this.logger.log(`verifyAccountExists returned INTERNAL_SERVER_ERROR retry ${index + 1}`)
            const result = await this.verifyAccountExists()
            if (result) {
              return true;
            }
          }
          this.logger.log("verifyAccountExists failed");
          return false;
        }
      } else if (result.data.me) {

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

      if (this.token != null) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }

      return this.token;
    } catch (error) {
      this.token = null;
      this.isLoggedIn = false;
    }
  }
}
