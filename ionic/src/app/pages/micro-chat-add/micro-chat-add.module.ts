import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MicroChatAddPageRoutingModule } from './micro-chat-add-routing.module';

import { MicroChatAddPage } from './micro-chat-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MicroChatAddPageRoutingModule,
    ReactiveFormsModule
  ],
  // declarations: [MicroChatAddPage]
})
export class MicroChatAddPageModule {}
