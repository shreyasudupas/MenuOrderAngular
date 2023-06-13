import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { Vendor } from './vendor';
import { environment as env } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { NavigationService } from 'src/app/common/services/navigation.service';

@Component({
    selector:'app-vendor',
    templateUrl: './vendor.component.html'
})

export class VendorComponent extends BaseComponent<Vendor[]> implements OnInit{
    activeList:any[];

    constructor(
        private menuService:MenuService,
        public override httpclient:HttpClient,
        public broadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        private router: Router,
        messageService:MessageService,
        public navigation:NavigationService
    ){
        super(menuService,httpclient,broadcastService,messageService)
    }

    vendorList:Vendor[]=[];

    ngOnInit(): void {
        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;

        this.InitilizeMenu();

        this.baseUrl = env.inventory.vendors;
        this.action = null;

        this.GetItem(new HttpParams()).subscribe((vendors)=>{
            //console.log(v)
            
            if(vendors !== null){
                this.vendorList = vendors
            }
        });

        this.activeList = [
            {label: 'True', value: 'true'},
            {label: 'False', value: 'false'},
        ]
    }

    editVendor(vendor:any){
        //debugger
        //console.log(vendor);
        // this.router.navigateByUrl('/admin/vendor-detail', { 
        //     state: {vendorId: vendor.id}
        // });
        this.navigation.startSaveHistory('/admin/vendor-detail/' + vendor.id);
        this.router.navigateByUrl('/admin/vendor-detail/' + vendor.id);
    }

    addNewVendor(){
        this.navigation.startSaveHistory('/admin/vendor-detail/0');
        this.router.navigateByUrl('/admin/vendor-detail/0');
    }
    
}