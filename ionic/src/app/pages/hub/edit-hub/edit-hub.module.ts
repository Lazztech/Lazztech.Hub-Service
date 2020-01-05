import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditHubPage } from './edit-hub.page';

const routes: Routes = [
  {
    path: '',
    component: EditHubPage,
  },
  {
    path: ':id',
    component: EditHubPage
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
  declarations: [EditHubPage]
})
export class EditHubPageModule {}
