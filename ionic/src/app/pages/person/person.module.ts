import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PersonPage } from './person.page';

const routes: Routes = [
  {
    path: '',
    component: PersonPage
  },
  {
    path: ':id',
    component: PersonPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PersonPage]
})
export class PersonPageModule {}
