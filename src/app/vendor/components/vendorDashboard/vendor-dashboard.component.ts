import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/common/services/auth.service';
import { UserDataSharingService } from 'src/app/common/services/user-datasharing.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'vendor-dashboard',
    templateUrl: './vendor-dashboard.component.html',
    styleUrls: [ './vendor-dashboard.component.scss' ]
})

export class VendorDashboardComponent implements OnInit{
    vendorId:string;
    sidebarVisible:boolean=false;
    enabled:boolean;
    
    constructor(public globlalService:UserDataSharingService,
        public authService:AuthService,
        private http:HttpClient,
        private router:Router) {
    }

     async ngOnInit() {
        this.vendorId = this.authService.GetVendorId();

        this.checkIfVendorEnabled();

        if(this.vendorId !== null && this.vendorId !== undefined){
            this.globlalService.updateVendorId(this.vendorId);
        }
    }

    displaySideMenuBar(){
        this.sidebarVisible = true;
    } 

    async checkIfVendorEnabled() {
        this.enabled = await this.isVendorEnabled();

        if(!this.enabled) {
            this.routeToVerificationPage();
        }
    }

    async isVendorEnabled() {
        let user = this.authService.getUserInformation();
        let url = environment.idsConfig.vendor + 'enable/' + user.profile['userId'];

        let vendorEnabled$ = this.http.get<boolean>(url);
        let vendorEnabled = await lastValueFrom(vendorEnabled$).catch( err => {
            console.log('Error occured in Vendor Enabled API',err);
            return false;
        });

        return vendorEnabled;
    }

    routeToVerificationPage() {
        
        //if vendorId undefined and Vendor is not enabled then route to verification page
        this.router.navigateByUrl('vendor/vendor-pre-registration/'+ ((this.vendorId === undefined)?'0':this.vendorId));
    }
}