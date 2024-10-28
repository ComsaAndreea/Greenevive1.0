import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvalidOpPageRoutingModule } from './invalid-op-routing.module';

import { InvalidOpPage } from './invalid-op.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvalidOpPageRoutingModule
  ],
  declarations: [InvalidOpPage]
})
export class InvalidOpPageModule {}
