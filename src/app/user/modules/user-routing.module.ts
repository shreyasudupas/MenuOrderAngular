import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FoodComponent } from "../components/food/food.component";
import { UserHomeComponent } from "../components/home/user-home.component";
import { UserDashboardComponent } from "../components/user-dashboard/user-dashboard.component";

const routes:Routes = [
    { path:'',component: UserDashboardComponent,children:[
            { path:'home', component: UserHomeComponent },
            { path:'food', component: FoodComponent },
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