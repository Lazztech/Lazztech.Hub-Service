import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'tabs', loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule), canActivate: [AuthGuard] },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule), canActivate: [AuthGuard] },
  { path: 'landing', loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingPageModule) },
  { path: 'login', loadChildren: () => import('./pages/auth/login/login.module').then(m => m.LoginPageModule) },
  { path: 'register', loadChildren: () => import('./pages/auth/register/register.module').then(m => m.RegisterPageModule) },
  { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule), canActivate: [AuthGuard] },
  { path: 'password-reset', loadChildren: () => import('./pages/auth/password-reset/password-reset.module').then(m => m.PasswordResetPageModule), canActivate: [AuthGuard] },
  { path: 'reset-pin', loadChildren: () => import('./pages/auth/reset-pin/reset-pin.module').then(m => m.ResetPinPageModule), canActivate: [AuthGuard] },
  { path: 'notifications', loadChildren: () => import('./pages/notifications/notifications.module').then(m => m.NotificationsPageModule), canActivate: [AuthGuard] },
  { path: 'people', loadChildren: () => import('./pages/people/people.module').then(m => m.PeoplePageModule), canActivate: [AuthGuard] },
  { path: 'hub', loadChildren: () => import('./pages/hub/hub.module').then(m => m.HubPageModule), canActivate: [AuthGuard] },
  { path: 'add-hub', loadChildren: () => import('./pages/add-hub/add-hub.module').then(m => m.AddHubPageModule), canActivate: [AuthGuard] },
  { path: 'edit-hub', loadChildren: () => import('./pages/hub/edit-hub/edit-hub.module').then(m => m.EditHubPageModule), canActivate: [AuthGuard] },
  { path: 'invite', loadChildren: () => import('./pages/hub/invite/invite.module').then(m => m.InvitePageModule), canActivate: [AuthGuard] },
  { path: 'person', loadChildren: () => import('./pages/people/person/person.module').then(m => m.PersonPageModule), canActivate: [AuthGuard] },
  { path: 'settings', loadChildren: () => import('./pages/profile/settings/settings.module').then(m => m.SettingsPageModule), canActivate: [AuthGuard] },
  { path: 'change-name', loadChildren: () => import('./pages/profile/settings/change-name/change-name.module').then(m => m.ChangeNamePageModule), canActivate: [AuthGuard] },
  { path: 'change-email', loadChildren: () => import('./pages/profile/settings/change-email/change-email.module').then(m => m.ChangeEmailPageModule), canActivate: [AuthGuard] },
  { path: 'change-password', loadChildren: () => import('./pages/profile/settings/change-password/change-password.module').then(m => m.ChangePasswordPageModule), canActivate: [AuthGuard] },
  { path: 'delete-account', loadChildren: () => import('./pages/profile/settings/delete-account/delete-account.module').then(m => m.DeleteAccountPageModule), canActivate: [AuthGuard] },
  { path: 'privacy', loadChildren: () => import('./pages/profile/privacy/privacy.module').then(m => m.PrivacyPageModule), canActivate: [AuthGuard] },
  { path: 'map', loadChildren: () => import('./pages/map/map.module').then(m => m.MapPageModule) },
  {
    path: 'micro-chat-add',
    loadChildren: () => import('./pages/micro-chat-add/micro-chat-add.module').then( m => m.MicroChatAddPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
