import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvalidOpPage } from './invalid-op.page';

const routes: Routes = [
  {
    path: '',
    component: InvalidOpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvalidOpPageRoutingModule {}
