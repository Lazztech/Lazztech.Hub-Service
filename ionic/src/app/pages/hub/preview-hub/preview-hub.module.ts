import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreviewHubPageRoutingModule } from './preview-hub-routing.module';

import { PreviewHubPage } from './preview-hub.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreviewHubPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PreviewHubPage]
})
export class PreviewHubPageModule {}
