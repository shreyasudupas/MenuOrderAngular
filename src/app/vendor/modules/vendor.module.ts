import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/common/module/common.module';
import { PrimeNGModule } from 'src/app/common/module/primeng.module';
import { VendorRoutingModule } from './vendor-routing.module';
import { VendorDashboardComponent } from '../components/vendorDashboard/vendor-dashboard.component';
import { VendorHomeComponent } from '../components/vendorHome/vendor-home.component';
import { RoleBasedAuthGaurd } from 'src/app/common/gaurds/role-based-routing-gaurd';
import { MessageService } from 'primeng/api';
import { LocationService } from 'src/app/common/services/location.service';
import { VendorPreRegistrationComponent } from '../components/vendor-pre-registration/vendor-pre-registration.component';
import { VendorService } from 'src/app/common/services/vendor.service';

@NgModule({
    declarations:[
        VendorDashboardComponent,
        VendorHomeComponent,
        VendorPreRegistrationComponent
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
        RoleBasedAuthGaurd,
        MessageService,
        LocationService,
        VendorService
    ]
})

export class VendorModule { }