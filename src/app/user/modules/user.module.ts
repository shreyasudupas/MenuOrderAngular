import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { RoleBasedAuthGaurd } from 'src/app/common/gaurds/role-based-routing-gaurd';
import { SharedModule } from 'src/app/common/module/common.module';
import { PrimeNGModule } from 'src/app/common/module/primeng.module';
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
        MenuComponent
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
        MessageService
    ]
})

export class UserModule { }