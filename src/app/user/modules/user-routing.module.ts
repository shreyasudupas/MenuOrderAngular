import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UserProfileComponent } from "src/app/common/components/user-profile/user-profile.component";
import { RoleBasedAuthGaurd } from "src/app/common/gaurds/role-based-routing-gaurd";
import { Role } from "src/app/common/models/role";
import { CartComponent } from "../components/cart-component/cart.component";
import { FoodComponent } from "../components/food/food.component";
import { UserHomeComponent } from "../components/home/user-home.component";
import { MenuComponent } from "../components/menu/menu.component";
import { UserDashboardComponent } from "../components/user-dashboard/user-dashboard.component";

const routes:Routes = [
    { path:'',component: UserDashboardComponent, canActivate:[RoleBasedAuthGaurd], data: { roles:[Role.User]}, children:[
            { path:'home', component: UserHomeComponent },
            { path:'food', component: FoodComponent },
            { path: 'cart', component: CartComponent },
            { path: 'menu/:vendorId' , component: MenuComponent },
            {
                path: 'profile', component: UserProfileComponent
            },
            { 
                path:'',
                redirectTo:'home',
                pathMatch:'full' 
            }
        ] 
    }
];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class UserRoutingModule {}