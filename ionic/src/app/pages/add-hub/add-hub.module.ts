import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddHubPage } from './add-hub.page';
import { HomePageModule } from 'src/app/home/home.module';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: AddHubPage,
    children: [
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
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ComponentsModule
  ],
  declarations: [AddHubPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddHubPageModule {}
