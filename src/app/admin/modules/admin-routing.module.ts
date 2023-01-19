import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from '../components/admin-dashboard/admin-dashboard.component';
import { CategoryDetailComponent } from '../components/categories/category-detail.component';
import { CuisineDetailsComponent } from '../components/cuisine-type-details/cuisine-details.component';
import { CuisineListDetails } from '../components/cuisine-type-list/cuisine-type-list.component';
import { FoodTypeDetailsComponent } from '../components/food-type-details/food-type-details.component';
import { FoodTypeListComponent } from '../components/food-type-list/food-type-list.component';
import { HomeComponent } from '../components/home/admin-home.component';
import { MenuDetailsComponent } from '../components/menu-details/menu-details.component';
import { MenuImageDetailsDashboardComponent } from '../components/menu-image-details/dashboard/menu-image-details-dashboard.component';
import { MenuImageListComponent } from '../components/menu-image-list/menu-image-list.component';
import { VendorDetailComponent } from '../components/vendor-details/vendor-detail.component';
import { VendorComponent } from '../components/vendor/vendor.component';
import { AdminGaurd } from '../gaurds/admin-gaurd';

const routes: Routes = [
  { path:'', component: AdminDashboardComponent,canActivate:[AdminGaurd], data: { roles: ['admin'] }, children: [
    {
      path: 'home', component: HomeComponent
    },
    {
      path:'vendor', component: VendorComponent
    },
    {
      path:'vendor-detail/:vendorId', component: VendorDetailComponent
    },
    {
      path:'category/:categoryId', component: CategoryDetailComponent
    },
    {
      path:'food-type-list', component: FoodTypeListComponent
    },
    {
      path:'food-type-details/:foodtypeId', component: FoodTypeDetailsComponent
    },
    {
      path:'cuisine-list', component: CuisineListDetails
    },
    {
      path:'cuisine-details/:cuisineId', component: CuisineDetailsComponent
    },
    {
      path:'vendor-detail/:vendorId/menu-details/:menuDetailsId', component: MenuDetailsComponent
    },
    {
      path:'image-menu-list', component: MenuImageListComponent
    },
    {
      path:'image-menu-details/:menuImageId', component: MenuImageDetailsDashboardComponent
    },
    { 
      path:'',
      redirectTo:'home',
      pathMatch:'full' 
    }
]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
