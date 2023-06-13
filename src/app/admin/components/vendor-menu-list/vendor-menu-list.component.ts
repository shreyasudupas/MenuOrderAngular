import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { environment } from 'src/environments/environment';
import { VendorMenuDetails } from '../menu-details/vendor-menu-details';
import { AuthService } from 'src/app/common/services/auth.service';

@Component({
    selector: 'vendor-menu-list',
    templateUrl:'./vendor-menu-list.component.html',
    providers: [ConfirmationService]
})

export class VendorMenuList extends BaseComponent<VendorMenuDetails> implements OnInit{
    vendorMenuItems:VendorMenuDetails[]=[];
    @Input() vendorId:string='';
    displayDeleteDialog:boolean = false;

    constructor(
        public menuService:MenuService,
        public override httpclient:HttpClient,
        public commonBroadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        private router:Router,
        messageService: MessageService,
        private confirmationService: ConfirmationService,
        public authService:AuthService){
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
        let role = this.authService.GetUserRole();
        let url = '/' + role + '/vendor-detail/';
        this.router.navigateByUrl(url + this.vendorId + '/menu-details/'+ menuId);
    }

    deleteMenuItem = (menuItem:VendorMenuDetails) => {

        this.baseUrl = environment.inventory.vendorMenu + '/' + menuItem.id;
        
        this.httpclient.delete(this.baseUrl).subscribe({
            next: result =>{
                if(result === true){
                    this.vendorMenuItems = this.vendorMenuItems.filter(x=>x.id != menuItem.id);

                    this.showInfo(`Successfully Removed ${menuItem.itemName}`);
                }else{
                    this.showError(`Error when removing ${menuItem.itemName}`);
                }
            },
            error: error => {
                console.log(error);
                this.showError(`Error when removing ${menuItem.itemName}`)
            }
        });
    }

    confirm(event: Event,menuItem:VendorMenuDetails) {
        this.confirmationService.confirm({
            target: event.target!,
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                //confirm action
                this.deleteMenuItem(menuItem);
            },
            reject: () => {
                //reject action
            }
        });
    }
}