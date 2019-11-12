import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddHubPage } from './add-hub.page';
import { HomePageModule } from 'src/app/home/home.module';

const routes: Routes = [
  {
    path: '',
    component: AddHubPage,
    children: [
      {
        path: 'create-hub',
        children: [
          {
            path: '',
            loadChildren: '../create-hub/create-hub.module#CreateHubPageModule'
          }
        ]
      },
      {
        path: 'join-hub',
        children: [
          {
            path: '',
            loadChildren: '../join-hub/join-hub.module#JoinHubPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/app/add-hub/add-hub',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddHubPage]
})
export class AddHubPageModule {}
