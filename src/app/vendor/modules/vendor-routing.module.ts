import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { VendorDashboardComponent } from "../components/vendorDashboard/vendor-dashboard.component";
import { VendorAuthGaurd } from "src/app/common/gaurds/vendor-routing-gaurd";
import { Role } from "src/app/common/models/role";
import { VendorHomeComponent } from "../components/vendorHome/vendor-home.component";

const routes:Routes = [
    { 
        path:'', component: VendorDashboardComponent, canActivate: [VendorAuthGaurd], data: { role:[ Role.Vendor ] } , children: [
            { path: 'home', component: VendorHomeComponent },
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