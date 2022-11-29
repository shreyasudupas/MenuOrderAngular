import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimeNGModule } from 'src/app/primeng.module';
import { MenuBarComponent } from '../components/menu/menu-bar.component';
import { ProfileComponent } from '../components/profile/profile.component';



@NgModule({
  declarations: [
    MenuBarComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule
  ],
  exports:[
    MenuBarComponent,
    ProfileComponent
  ]
})
export class SharedModule { }
