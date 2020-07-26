import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreviewHubPageRoutingModule } from './preview-hub-routing.module';

import { PreviewHubPage } from './preview-hub.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreviewHubPageRoutingModule
  ],
  declarations: [PreviewHubPage]
})
export class PreviewHubPageModule {}
