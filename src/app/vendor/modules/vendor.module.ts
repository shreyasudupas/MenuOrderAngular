import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/common/module/common.module';
import { PrimeNGModule } from 'src/app/common/module/primeng.module';
import { VendorRoutingModule } from './vendor-routing.module';
import { VendorAuthGaurd } from 'src/app/common/gaurds/vendor-routing-gaurd';
import { VendorDashboardComponent } from '../components/vendorDashboard/vendor-dashboard.component';
import { VendorHomeComponent } from '../components/vendorHome/vendor-home.component';

@NgModule({
    declarations:[
        VendorDashboardComponent,
        VendorHomeComponent
    ],
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        PrimeNGModule,
        VendorRoutingModule
    ],
    providers:[
        VendorAuthGaurd
    ]
})

export class VendorModule { }