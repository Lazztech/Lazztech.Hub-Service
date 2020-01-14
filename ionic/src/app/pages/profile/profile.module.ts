import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfilePage } from './profile.page';
import { ChangeNamePage } from './change-name/change-name.page';
import { ChangeEmailPage } from './change-email/change-email.page';
import { ChangePasswordPage } from './change-password/change-password.page';
import { DeleteAccountPage } from './delete-account/delete-account.page';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ComponentsModule
  ],
  declarations: [ProfilePage, ChangeNamePage, ChangeEmailPage, ChangePasswordPage, DeleteAccountPage],
  entryComponents: [ChangeNamePage, ChangeEmailPage, ChangePasswordPage, DeleteAccountPage]
})
export class ProfilePageModule {}
