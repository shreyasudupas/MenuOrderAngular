import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { AuthService } from 'src/app/common/services/auth.service';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { NavigationService } from 'src/app/common/services/navigation.service';
import { environment } from 'src/environments/environment';
import { Menu } from './menu';

@Component({
    selector:'vendor-menu',
    templateUrl:'./menu.component.html'
})

export class MenuComponent extends BaseComponent<Menu> implements OnInit {
vendorId:string;
menus:Menu[];
expandedRows: {} = {};

    constructor(
        public menuService:MenuService,
        public override httpclient:HttpClient,
        public commonBroadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        private router:Router,
        messageService: MessageService,
        public navigation:NavigationService,
        public authService:AuthService){
            super(menuService,httpclient,commonBroadcastService,messageService)
    }
    
    ngOnInit(): void {
        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;

        this.InitilizeMenu();

        this.vendorId = this.activatedRoute.snapshot.params['vendorId'];

        console.log('menu page ' + this.navigation.history);

        if(this.vendorId != '')
            this.getVendorMenuDetails(this.vendorId);
    }

    getVendorMenuDetails(vendorId:string){
        this.baseUrl = environment.inventory.vendorMenu;
        this.action = 'list/' + vendorId;

        this.ListItems(null).subscribe({
            next: result => {
                this.menus = result;

                if(this.menus !== null)
                {
                    const thisRef = this;
                    let categories = [];
                    this.menus.map(menu=>{
                        if(menu.image.imageFileName !== ''){
                            menu.image.imageFileName = environment.imagePath + menu.image.imageFileName;
                        }
                        
                        let currentCategory = menu.category;
                        if(!categories.includes(currentCategory)){
                            categories.push(menu.category);
                            thisRef.expandedRows[menu.category]=true;
                        }
                        //console.log(categories);

                    });
                }
            },
            error: error => {
                console.log(error);
            }
        })
    }

    backToVendor(){
        this.navigation.goBack();
    }

}