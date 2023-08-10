import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage, provideImgixLoader } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from 'src/app/common/module/common.module';
import { AdminDashboardComponent } from '../components/admin-dashboard/admin-dashboard.component';
import { HomeComponent } from '../components/home/admin-home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VendorComponent } from '../components/vendor/vendor.component';
import { PrimeNGModule } from 'src/app/common/module/primeng.module';
import { FoodTypeListComponent } from '../components/food-type-list/food-type-list.component';
import { FoodTypeDetailsComponent } from '../components/food-type-details/food-type-details.component';
import { CuisineListDetails } from '../components/cuisine-type-list/cuisine-type-list.component';
import { CuisineDetailsComponent } from '../components/cuisine-type-details/cuisine-details.component';
import { MenuImageListComponent } from '../components/menu-image-list/menu-image-list.component';
import { MenuImageDetailsDashboardComponent } from '../components/menu-image-details/dashboard/menu-image-details-dashboard.component';
import { MenuImageDetailsComponent } from '../components/menu-image-details/menu-image-details/menu-image-details.component';
import { MenuImageUploadComponent } from '../components/menu-image-details/image-upload-details/menu-image-upload.component';
import { RoleBasedAuthGaurd } from 'src/app/common/gaurds/role-based-routing-gaurd';
import { InviteUserToVendorComponent } from '../components/invite-users-to-vendor/invite-user-vendor-component';
import { MessageService } from 'primeng/api';
import { LocationService } from 'src/app/common/services/location.service';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    HomeComponent,
    VendorComponent,
    FoodTypeListComponent,
    FoodTypeDetailsComponent,
    CuisineListDetails,
    CuisineDetailsComponent,
    MenuImageListComponent,
    MenuImageDetailsDashboardComponent,
    MenuImageDetailsComponent,
    MenuImageUploadComponent,
    InviteUserToVendorComponent
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    SharedModule,
    PrimeNGModule,
    ReactiveFormsModule,
    NgOptimizedImage
  ],
  providers: [ 
    RoleBasedAuthGaurd,
    MessageService,
    LocationService
    //provideImgixLoader('https://localhost:5003/app-images/')
   ]
})
export class AdminModule { }
