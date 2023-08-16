import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LocationSearchDropdown } from 'src/app/common/components/location-search-dropdown/location-search-dropdown.component';
import { ClickOutsideDirective } from 'src/app/common/directives/clickOutside.directive';
import { RoleBasedAuthGaurd } from 'src/app/common/gaurds/role-based-routing-gaurd';
import { SharedModule } from 'src/app/common/module/common.module';
import { PrimeNGModule } from 'src/app/common/module/primeng.module';
import { LocationService } from 'src/app/common/services/location.service';
import { CartComponent } from '../components/cart-component/cart.component';
import { CartIconComponent } from '../components/cart-icon-component/cart-icon.component';
import { FoodComponent } from '../components/food/food.component';
import { UserHomeComponent } from '../components/home/user-home.component';
import { MenuComponent } from '../components/menu/menu.component';
import { UserDashboardComponent } from '../components/user-dashboard/user-dashboard.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
    declarations:[
        UserDashboardComponent,
        UserHomeComponent,
        FoodComponent,
        MenuComponent,
        CartComponent,
        CartIconComponent,
        ClickOutsideDirective,
        LocationSearchDropdown
    ],
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        PrimeNGModule,
        UserRoutingModule
    ],
    providers:[
        RoleBasedAuthGaurd,
        MessageService,
        LocationService
    ]
})

export class UserModule { }