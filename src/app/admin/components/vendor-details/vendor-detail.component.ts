import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BaseComponent } from "src/app/common/components/base/base.component";
import { CommonDataSharingService } from "src/app/common/services/common-datasharing.service";
import { MenuService } from "src/app/common/services/menu.service";

@Component({
    selector: 'vendor-detail',
    templateUrl: './vendor-detail.component.html'
})
export class VendorDetailComponent extends BaseComponent<any> implements OnInit{
vendorId!:string;

    constructor(
        public menuService:MenuService,
        public override httpclient:HttpClient,
        public commonBroadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute){
            super(menuService,httpclient,commonBroadcastService)
    }

    ngOnInit(): void {
        debugger
        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;

        this.InitilizeMenu();

        let vendoreIdState = history.state.navigationId;
        if(vendoreIdState !== undefined){
            this.vendorId = vendoreIdState;
        }else{
            alert('undefined')
        }
    }
}