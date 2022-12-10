import { NgModule } from '@angular/core';
import { LandscapeComponent } from './container/landscape.component';
import { RouterModule } from '@angular/router';

const routes = [
  {
    path: '',
    component: LandscapeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandscapeRoutingModule {}
