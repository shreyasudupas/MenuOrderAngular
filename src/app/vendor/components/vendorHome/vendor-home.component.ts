import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { filter } from 'rxjs';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { NavigationService } from 'src/app/common/services/navigation.service';
import { UserDataSharingService } from 'src/app/common/services/user-datasharing.service';

@Component({
    selector:'vendor-home',
    templateUrl:'./vendor-home.component.html',
    providers:[ MessageService ]
})

export class VendorHomeComponent extends BaseComponent<any> implements OnInit {
    
    constructor(private menuService:MenuService,
        public override httpclient:HttpClient,
        public commonBroadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        messageService:MessageService,
        public router:Router,
        public globlalService:UserDataSharingService,
        public navigation:NavigationService){
        super(menuService,httpclient,commonBroadcastService,messageService)
    }

    ngOnInit(): void {
        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;

        this.InitilizeMenu();

        this.navigation.startSaveHistory('vendor/home');

    }

    goToVendorDetailPage() {
        
        this.globlalService.getVendorId().subscribe(result=>{
            if(result != null){
                let vendorId = result;

                this.router.navigateByUrl('vendor/vendor-detail/'+ vendorId);
            }
        });
    }
}