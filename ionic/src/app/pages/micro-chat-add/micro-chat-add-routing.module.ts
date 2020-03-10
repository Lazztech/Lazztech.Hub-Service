import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MicroChatAddPage } from './micro-chat-add.page';

const routes: Routes = [
  {
    path: '',
    component: MicroChatAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MicroChatAddPageRoutingModule {}
