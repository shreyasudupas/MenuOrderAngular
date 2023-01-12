import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { environment } from 'src/environments/environment';
import { MenuDetails } from '../menu-details/menu-details';

@Component({
    selector: 'vendor-menu-list',
    templateUrl:'./vendor-menu-list.component.html',
    providers: [MessageService]
})

export class VendorMenuList extends BaseComponent<MenuDetails> implements OnInit{
    vendorMenuItems:MenuDetails[]=[];
    @Input() vendorId:string='';

    constructor(
        public menuService:MenuService,
        public override httpclient:HttpClient,
        public commonBroadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        private router:Router,
        messageService: MessageService){
            super(menuService,httpclient,commonBroadcastService,messageService)
    }
    
    ngOnInit(): void {
        

        this.baseUrl = environment.inventory.vendorMenu;
        this.action = 'list/' + this.vendorId;
        this.ListItems(new HttpParams()).subscribe({
            next: result => {
                this.vendorMenuItems = result;
            }
        })
    }

    goToMenuPage = (menuId:string) => {
        this.router.navigateByUrl('/admin/vendor-detail/'+this.vendorId + '/menu-details/'+ menuId);
    }
}