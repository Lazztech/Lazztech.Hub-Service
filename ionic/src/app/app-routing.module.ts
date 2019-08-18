import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule',
    canActivate: [AuthGuard]
  },
  { path: 'landing', loadChildren: './pages/landing/landing.module#LandingPageModule' },
  { path: 'login', loadChildren: './pages/auth/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './pages/auth/register/register.module#RegisterPageModule' },
  { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule', canActivate: [AuthGuard] },
  { path: 'password-reset', loadChildren: './pages/auth/password-reset/password-reset.module#PasswordResetPageModule', canActivate: [AuthGuard] },
  { path: 'reset-pin', loadChildren: './pages/auth/reset-pin/reset-pin.module#ResetPinPageModule', canActivate: [AuthGuard] },
  { path: 'change-name', loadChildren: './pages/profile/change-name/change-name.module#ChangeNamePageModule', canActivate: [AuthGuard] },
  { path: 'change-email', loadChildren: './pages/profile/change-email/change-email.module#ChangeEmailPageModule', canActivate: [AuthGuard] },
  { path: 'change-password', loadChildren: './pages/profile/change-password/change-password.module#ChangePasswordPageModule', canActivate: [AuthGuard] },
  { path: 'delete-account', loadChildren: './pages/profile/delete-account/delete-account.module#DeleteAccountPageModule', canActivate: [AuthGuard] },
  { path: 'invite', loadChildren: './pages/invite/invite.module#InvitePageModule', canActivate: [AuthGuard] },
  { path: 'notifications', loadChildren: './pages/notifications/notifications.module#NotificationsPageModule', canActivate: [AuthGuard] },
  { path: 'people', loadChildren: './pages/people/people.module#PeoplePageModule' },
  { path: 'person', loadChildren: './pages/person/person.module#PersonPageModule' },
  { path: 'timeline', loadChildren: './pages/timeline/timeline.module#TimelinePageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
