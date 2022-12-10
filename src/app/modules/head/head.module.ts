import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeadRoutingModule } from './head-routing.module';
import { HeadComponent } from './container/head.component';

@NgModule({
  declarations: [HeadComponent],
  imports: [CommonModule, HeadRoutingModule],
})
export class HeadModule {}
