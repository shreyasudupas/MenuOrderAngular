import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Vendor } from 'src/app/admin/components/vendor/vendor';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { LocationService } from 'src/app/common/services/location.service';
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
showLocationErrorDialog:boolean = false;

    constructor(private menuService:MenuService,
        public override httpclient:HttpClient,
        public commonBroadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        messageService:MessageService,
        public router:Router,
        public navigation:NavigationService,
        private location:LocationService){
        super(menuService,httpclient,commonBroadcastService,messageService)
    }

    ngOnInit(): void {
        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;

        this.InitilizeMenu();

        this.showVendorList();
        
        console.log('Food page' + this.navigation.history);

        this.navigation.startSaveHistory('food/menu')
    }

    showVendorList(): void {

        this.location.getUserLocationUpdate().subscribe({
            next: result => {
                //this.getVendorList();
                if(result !== undefined){
                    this.showLocationErrorDialog = false;

                    this.getNearestVendorList(result.latitude,result.longitude);
                }else {
                    this.showLocationErrorDialog = true;
                }
                
            },
            error: err => {
                console.log('Error occured in subscribing the user location ',err);
            }
        });

    }

    getVendorList(){
        this.baseUrl = environment.inventory.vendors;
        this.action = null;

        this.ListItems(null).subscribe({
            next: result => {
                if(result != null){
                    this.vendors = result;

                    this.vendors.map(vendor=>{
                        if(vendor.image.imageFileName !== '')
                            vendor.image.imageFileName = environment.imagePath + vendor.image.imageFileName;
                    });

                    //console.log(this.vendors)
                }
            }
        });
    }

    getNearestVendorList(latitude:number,longitude:number){
        this.baseUrl = environment.inventory.vendors;
        this.action = 'near';

        let params = new HttpParams().set('latitude',latitude)
        .set('longitude',longitude)
        .set('distanceInKM',1);

        this.ListItems(params).subscribe({
            next: result => {
                this.vendors = result;

                    this.vendors.map(vendor=>{
                        if(vendor.image.imageFileName !== '')
                            vendor.image.imageFileName = environment.imagePath + vendor.image.imageFileName;
                    });
            },
            error: err => {
                console.log('Error occured in Nearest Vendor API ',err);
            }
        });
    }

    callMenuDetails(vendorId:string) {
        this.router.navigateByUrl('/user/menu/' + vendorId);
    }
}