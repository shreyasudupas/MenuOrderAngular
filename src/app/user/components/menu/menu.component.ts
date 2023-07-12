import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ImageModel } from 'src/app/admin/components/vendor/vendor';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { AuthService } from 'src/app/common/services/auth.service';
import { CartInformationSerivice } from 'src/app/common/services/cart-information.service';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { NavigationService } from 'src/app/common/services/navigation.service';
import { environment } from 'src/environments/environment';
import { CartInformation } from '../cart-component/cart-information';
import { Menu } from './menu';

@Component({
    selector:'vendor-menu',
    templateUrl:'./menu.component.html',
    styleUrls: [ './menu.component.css' ]
})

export class MenuComponent extends BaseComponent<Menu> implements OnInit {
vendorId:string;
menus:CartInformation[];
expandedRows: {} = {};

    constructor(
        public menuService:MenuService,
        public override httpclient:HttpClient,
        public commonBroadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        private router:Router,
        messageService: MessageService,
        public navigation:NavigationService,
        public authService:AuthService,
        public cartInformationService:CartInformationSerivice){
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

                if(result !== null)
                {
                    this.menus = [];
                    const thisRef = this;
                    let categories = [];
                    result.map(menu=>{
                        if(menu.image.imageFileName !== ''){
                            menu.image.imageFileName = environment.imagePath + menu.image.imageFileName;
                        }
                        
                        let currentCategory = menu.category;
                        if(!categories.includes(currentCategory)){
                            categories.push(menu.category);
                            thisRef.expandedRows[menu.category]=true;
                        }
                        //console.log(categories);
                        this.menus.push({
                            id: menu.id,itemName: menu.itemName, price: menu.price, active: menu.active, category: menu.category,
                            discount: menu.discount, foodType: menu.foodType, quatity:0, rating: menu.rating, vendorId: menu.vendorId,
                            image: menu.image
                        });
                    });
                }

                //console.log(this.menus);
            },
            error: error => {
                console.log(error);
            }
        })
    }

    backToVendor(){
        this.navigation.goBack();
    }

    clear(table: Table) {
        table.clear();
    }

    addMenuItem(menuItem:CartInformation) {
        let item: CartInformation = { id: menuItem.id,vendorId: menuItem.vendorId,itemName: menuItem.itemName, image: menuItem.image, foodType: menuItem.foodType,
        category: menuItem.category, price: menuItem.price, discount: menuItem.discount, rating: menuItem.rating, active: menuItem.active, quatity: menuItem.quatity + 1 };

        if(item.quatity >= 0){
            //update cart service
            this.cartInformationService.modifyMenuCart(item);

            //update menu in table
            this.modifyMenuItems(item);

            console.log('Menu after add cart items: ',this.menus);
        }
    }

    removeMenuItem(menuItem:CartInformation) {
        let item: CartInformation = { id: menuItem.id,vendorId: menuItem.vendorId,itemName: menuItem.itemName, image: menuItem.image, foodType: menuItem.foodType,
        category: menuItem.category, price: menuItem.price, discount: menuItem.discount, rating: menuItem.rating, active: menuItem.active, quatity: menuItem.quatity - 1 };

        if(item.quatity >= 0){
            //update cart service
            this.cartInformationService.modifyMenuCart(item);

            //update menu in table
            this.modifyMenuItems(item);

            if(item.quatity == 0){
                this.cartInformationService.removeItemCart(item);
            }
            console.log('Menu after remove cart items: ',this.menus);
        }
    }

    modifyMenuItems(menuItem:CartInformation){
        this.menus = this.menus.map(item=> (item.id === menuItem.id)? {...item,quatity: menuItem.quatity} : {...item});
    }
}