import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from '../components/admin-dashboard/admin-dashboard.component';
import { CategoryDetailComponent } from '../components/categories/category-detail.component';
import { FoodtypeDetailsComponent } from '../components/food-type-details/food-type-details.component';
import { FoodTypeListComponent } from '../components/food-type-list/food-type-list.component';
import { HomeComponent } from '../components/home/admin-home.component';
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
      path:'food-type-details/:foodtypeId', component: FoodtypeDetailsComponent
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
