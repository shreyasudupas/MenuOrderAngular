import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
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
import { CategoryListComponent } from '../components/category-list/category-list.component';
import { VendorMenuList } from '../components/vendor-menu-list/vendor-menu-list.component';
import { MenuImageListComponent } from '../components/menu-image-list/menu-image-list.component';
import { MenuImageDetailsDashboardComponent } from '../components/menu-image-details/dashboard/menu-image-details-dashboard.component';
import { MenuImageDetailsComponent } from '../components/menu-image-details/menu-image-details/menu-image-details.component';
import { MenuImageUploadComponent } from '../components/menu-image-details/image-upload-details/menu-image-upload.component';
import { ImmageSelectionListComponent } from '../components/image-selection-list/image-selection-list.component';
import { AdminAuthGaurd } from 'src/app/common/gaurds/admin-routing-gaurd';


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
    MenuDetailsComponent,
    CategoryListComponent,
    VendorMenuList,
    MenuImageListComponent,
    MenuImageDetailsDashboardComponent,
    MenuImageDetailsComponent,
    MenuImageUploadComponent,
    ImmageSelectionListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    SharedModule,
    PrimeNGModule,
    ReactiveFormsModule
  ],
  providers: [ AdminAuthGaurd ]
})
export class AdminModule { }
