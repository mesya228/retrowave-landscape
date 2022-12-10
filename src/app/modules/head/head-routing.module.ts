import { NgModule } from '@angular/core';
import { HeadComponent } from './container/head.component';
import { RouterModule } from '@angular/router';

const routes = [
  {
    path: '',
    component: HeadComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HeadRoutingModule {}
