import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Vendor } from 'src/app/admin/components/vendor/vendor';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { NavigationService } from 'src/app/common/services/navigation.service';
import { environment } from 'src/environments/environment';

@Component({
    selector:'food-list',
    templateUrl: './food.component.html',
    styleUrls:[ './food.component.scss' ]
})

export class FoodComponent extends BaseComponent<any> implements OnInit{
vendors:Vendor[];

    constructor(private menuService:MenuService,
        public override httpclient:HttpClient,
        public commonBroadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        messageService:MessageService,
        public router:Router,
        public navigation:NavigationService){
        super(menuService,httpclient,commonBroadcastService,messageService)
    }

    ngOnInit(): void {
        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;

        this.InitilizeMenu();

        this.getVendorList();
    }

    getVendorList(){
        this.baseUrl = environment.inventory.vendors;
        this.action = null;

        this.ListItems(null).subscribe({
            next: result => {
                if(result != null){
                    this.vendors = result;

                    this.vendors.map(vendor=>{
                        vendor.image.imageFileName = environment.imagePath + vendor.image.imageFileName;
                    });

                    console.log(this.vendors)
                }
            }
        });
    }
}