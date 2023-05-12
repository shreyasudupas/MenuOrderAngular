import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/common/services/auth.service';
import { UserDataSharingService } from 'src/app/common/services/user-datasharing.service';

@Component({
    selector: 'vendor-dashboard',
    templateUrl: './vendor-dashboard.component.html'
})

export class VendorDashboardComponent implements OnInit{
    vendorId:string;
    
    constructor(public globlalService:UserDataSharingService,public authService:AuthService) {
    }

    ngOnInit(): void {
        this.vendorId = this.authService.GetVendorId();

        if(this.vendorId !== null && this.vendorId !== undefined){
            this.globlalService.updateVendorId(this.vendorId);
        }
    }
}