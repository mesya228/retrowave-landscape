import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandscapeRoutingModule } from './landscape-routing.module';
import { LandscapeComponent } from './container/landscape.component';

@NgModule({
  declarations: [LandscapeComponent],
  imports: [CommonModule, LandscapeRoutingModule],
})
export class LandscapeModule {}
