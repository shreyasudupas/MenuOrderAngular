import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminGaurd } from '../gaurds/admin-gaurd';
import { SharedModule } from 'src/app/common/module/common.module';
import { AdminDashboardComponent } from '../components/admin-dashboard/admin-dashboard.component';
import { HomeComponent } from '../components/home/admin-home.component';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ],
  providers: [ AdminGaurd ]
})
export class AdminModule { }
