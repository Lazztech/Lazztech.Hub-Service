import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreviewHubPage } from './preview-hub.page';

const routes: Routes = [
  {
    path: '',
    component: PreviewHubPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreviewHubPageRoutingModule {}
