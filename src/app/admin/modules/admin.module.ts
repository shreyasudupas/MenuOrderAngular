import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminGaurd } from '../gaurds/admin-gaurd';
import { SharedModule } from 'src/app/common/module/common.module';
import { AdminDashboardComponent } from '../components/admin-dashboard/admin-dashboard.component';
import { HomeComponent } from '../components/home/admin-home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VendorComponent } from '../components/vendor/vendor.component';
import { PrimeNGModule } from 'src/app/common/module/primeng.module';
import { VendorDetailComponent } from '../components/vendor-details/vendor-detail.component';
import { CategoryDetailComponent } from '../components/categories/category-detail.component';
import { FoodTypeListComponent } from '../components/food-type-list/food-type-list.component';
import { FoodTypeDetailsComponent } from '../components/food-type-details/food-type-details.component';
import { CuisineListDetails } from '../components/cuisine-type-list/cuisine-type-list.component';
import { CuisineDetailsComponent } from '../components/cuisine-type-details/cuisine-details.component';
import { MenuDetailsComponent } from '../components/menu-details/menu-details.component';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    HomeComponent,
    VendorComponent,
    VendorDetailComponent,
    CategoryDetailComponent,
    FoodTypeListComponent,
    FoodTypeDetailsComponent,
    CuisineListDetails,
    CuisineDetailsComponent,
    MenuDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    SharedModule,
    PrimeNGModule,
    ReactiveFormsModule
  ],
  providers: [ AdminGaurd ]
})
export class AdminModule { }
