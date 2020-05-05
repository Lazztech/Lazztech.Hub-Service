import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminHubPage } from './admin-hub.page';

const routes: Routes = [
  {
    path: '',
    component: AdminHubPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminHubPageRoutingModule {}
