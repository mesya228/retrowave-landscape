import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/landscape/landscape.module').then((m) => m.LandscapeModule) },
  { path: 'head', loadChildren: () => import('./modules/head/head.module').then((m) => m.HeadModule) },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
