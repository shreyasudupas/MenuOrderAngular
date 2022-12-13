import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { Vendor } from './vendor';
import { environment as env } from 'src/environments/environment';

@Component({
    selector:'app-vendor',
    templateUrl: './vendor.component.html'
})

export class VendorComponent extends BaseComponent<Vendor[]> implements OnInit{

    constructor(
        private menuService:MenuService,
        public override httpclient:HttpClient,
        public broadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        private router: Router
    ){
        super(menuService,httpclient,broadcastService)
    }

    vendorList:Vendor[]=[];

    ngOnInit(): void {
        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;

        this.InitilizeMenu();

        this.baseUrl = env.inventoryBaseUrl;
        this.action = null;

        this.GetItem(new HttpParams()).subscribe((vendors)=>{
            //console.log(v)
            
            if(vendors !== null){
                this.vendorList = vendors
            }
        });
    }

    editVendor(vendor:any){
        //debugger
        //console.log(vendor);
        this.router.navigateByUrl('/admin/vendor-detail', { 
            state: {vendorId: vendor.id}
        });
    }
    
}