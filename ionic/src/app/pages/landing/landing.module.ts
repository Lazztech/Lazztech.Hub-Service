import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LandingPage } from './landing.page';
import { LoginPage } from '../auth/login/login.page';
import { RegisterPage } from '../auth/register/register.page';
import { PasswordResetPage } from '../auth/password-reset/password-reset.page';
import { ResetPinPage } from '../auth/reset-pin/reset-pin.page';

const routes: Routes = [
  {
    path: '',
    component: LandingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [LandingPage, LoginPage, RegisterPage, PasswordResetPage, ResetPinPage],
  entryComponents: [LoginPage, RegisterPage, PasswordResetPage, ResetPinPage]
})
export class LandingPageModule {}
