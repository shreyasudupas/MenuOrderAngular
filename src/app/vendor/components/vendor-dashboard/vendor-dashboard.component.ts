import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { VendorUserMappingEnableResponse } from 'src/app/admin/components/vendor-user-list/vendor-user-mapping';
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
    enableMenuBar:boolean;
    showPreRegistrationPage:boolean = false;
    
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
        let user = this.authService.getUserInformation();
        let userId = user.profile['userId'];

        let userVendorMappingEnabled = await this.isUserVendorMappingEnabled(userId);
        if(userVendorMappingEnabled !== null) {

            //if user is admin then redirect them to pre registration mail but check if they are enabled
            if(userVendorMappingEnabled.isEnabled === false && userVendorMappingEnabled.isVendorPresent === false) {
                this.enableMenuBar = await this.isVendorEnabled(userId);

                //if user is enabled then dont show pre registration mail or else user is diabled then show registration mail
                this.showPreRegistrationPage = !this.enableMenuBar;  

            } else if (userVendorMappingEnabled.isEnabled === false && userVendorMappingEnabled.isVendorPresent === true) {
                //then subuser of the vendor is not enabled, so contact the admin for enabling
                this.showPreRegistrationPage = false;
                this.enableMenuBar = false;
            } else {
                //if sub vendor user is valid is present and also enabled
                this.showPreRegistrationPage = false;
                this.enableMenuBar = true;
            }
        } else {
            console.error('Error has occured in Vendor mapping');
        }
        //this.enabled = await this.isVendorEnabled(user.profile['userId']);

        if(this.showPreRegistrationPage) {
            this.routeToPreRegistrationPage();
        }
    }

    async isVendorEnabled(userId:string) {
        
        let url = environment.idsConfig.vendor + 'enable/' + userId;

        let vendorEnabled$ = this.http.get<boolean>(url);
        let vendorEnabled = await lastValueFrom(vendorEnabled$).catch( err => {
            console.log('Error occured in Vendor Enabled API',err);
            return false;
        });

        return vendorEnabled;
    }

    async isUserVendorMappingEnabled(userId:string) : Promise<VendorUserMappingEnableResponse | null>  {
        let url = environment.idsConfig.vendorUserMapping + '/enabled';
        let params = new HttpParams().set('vendorId',this.vendorId).set('userId',userId);

        let vendorEnabled$ = this.http.get<VendorUserMappingEnableResponse>(url,{params: params});
        let vendorEnabled = await lastValueFrom(vendorEnabled$).catch( err => {
            console.log('Error occured in Vendor Enabled API',err);
            return null;
        });

        return vendorEnabled;
    }

    routeToPreRegistrationPage() {
        
        //if vendorId undefined and Vendor is not enabled then route to verification page
        this.router.navigateByUrl('vendor/vendor-pre-registration/'+ ((this.vendorId === undefined)?'0':this.vendorId));
    }
}