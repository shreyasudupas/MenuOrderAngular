import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';

@Component({
    selector:'app-vendor',
    templateUrl: './vendor.component.html'
})

export class VendorComponent extends BaseComponent<void> implements OnInit{

    constructor(
        private menuService:MenuService,
        public override httpclient:HttpClient,
        public broadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        private router: Router
    ){
        super(menuService,httpclient,broadcastService)
    }

    vendorList:any = [
        { id:1,name:'A2B',category:'Vegiterian',location:'Bangalore',type:'Restaurent' },
        { id:2,name:'A2B',category:'Vegiterian/Non Veg',location:'Bangalore',type:'Fast Food' },
        { id:3,name:'Test Cafe',category:'Vegiterian/Non Veg',location:'Bangalore',type:'Cafe' }
    ]

    ngOnInit(): void {
        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;

        this.InitilizeMenu();
    }

    editVendor(vendor:any){
        //console.log(vendor);
        this.router.navigateByUrl('/admin/vendor-detail', { state: vendor.id});
    }
    
}