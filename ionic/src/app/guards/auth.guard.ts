import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { NetworkService } from '../services/network.service';
import { AlertService } from '../services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    private networkService: NetworkService,
    private alertService: AlertService
  ) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
      const currentUser = this.authService.isLoggedIn;

      // Done with callbacks so that it doesn't block causing sluggishness going between pages.
      //FIXME: this seems to be failing on cold starts with serverless
      // this.networkService.isConnected().then((online) => {
      //   if (online) {
      //     this.authService.verifyAccountExists().then((stillValid) => {
      //       if (!stillValid) {
      //         this.alertService.presentRedToast("Logged out.", 6000);
      //         this.authService.logout();
      //         this.router.navigate(['/landing']);
      //         return false;
      //       }
      //     });
      //   }
      // });

      if (currentUser) {
          // authorized so return true
          return true;
      }
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/landing']);
      return false;
  }
}