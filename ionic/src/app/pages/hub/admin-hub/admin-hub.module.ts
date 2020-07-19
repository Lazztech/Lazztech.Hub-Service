import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminHubPageRoutingModule } from './admin-hub-routing.module';

import { AdminHubPage } from './admin-hub.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminHubPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    DirectivesModule,
  ],
  declarations: [AdminHubPage]
})
export class AdminHubPageModule {}
