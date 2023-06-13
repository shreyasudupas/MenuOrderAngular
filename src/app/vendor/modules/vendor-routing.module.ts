import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { VendorDashboardComponent } from "../components/vendorDashboard/vendor-dashboard.component";
import { Role } from "src/app/common/models/role";
import { VendorHomeComponent } from "../components/vendorHome/vendor-home.component";
import { VendorDetailComponent } from "src/app/admin/components/vendor-details/vendor-detail.component";
import { CategoryDetailComponent } from "src/app/admin/components/categories/category-detail.component";
import { MenuDetailsComponent } from "src/app/admin/components/menu-details/menu-details.component";
import { RoleBasedAuthGaurd } from "src/app/common/gaurds/role-based-routing-gaurd";

const routes:Routes = [
    { 
        path:'', component: VendorDashboardComponent, canActivate: [RoleBasedAuthGaurd], data: { role:[ Role.Vendor ] } , children: [
            { path: 'home', component: VendorHomeComponent },
            {
                path:'vendor-detail/:vendorId', component: VendorDetailComponent
            },
            {
                path:'category/:categoryId', component: CategoryDetailComponent
            },
            {
                path:'vendor-detail/:vendorId/menu-details/:menuDetailsId', component: MenuDetailsComponent
            },
            { 
                path:'',
                redirectTo:'home',
                pathMatch:'full' 
              }
        ] 
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class VendorRoutingModule { }