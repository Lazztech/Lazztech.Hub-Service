import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminHubPageRoutingModule } from './admin-hub-routing.module';

import { AdminHubPage } from './admin-hub.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminHubPageRoutingModule
  ],
  declarations: [AdminHubPage]
})
export class AdminHubPageModule {}
