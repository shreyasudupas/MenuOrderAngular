import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { AuthService } from 'src/app/common/services/auth.service';
import { CartInformationSerivice } from 'src/app/common/services/cart-information.service';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { NavigationService } from 'src/app/common/services/navigation.service';
import { environment } from 'src/environments/environment';
import { CartMenuItem } from '../cart-component/cart-information';
import { Menu } from './menu';

@Component({
    selector:'vendor-menu',
    templateUrl:'./menu.component.html',
    styleUrls: [ './menu.component.css' ]
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
                    let cartInformation = this.cartInformationService.getAllCartInfo();

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

                        let cartInfo = cartInformation.menuItems.find(x=>x.menuId === menu.id);
                        let quantity = 0;
                        if(cartInfo !== undefined){
                            quantity = cartInfo.quantity;
                        }

                        this.menus.push({
                            id: menu.id,itemName: menu.itemName, price: menu.price, active: menu.active, category: menu.category,
                            discount: menu.discount, foodType: menu.foodType, rating: menu.rating, vendorId: menu.vendorId,
                            image: menu.image,quantity: quantity
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

    async addMenuItem(menuItem:Menu) {
        let item: CartMenuItem = { menuId: menuItem.id,vendorId: menuItem.vendorId,itemName: menuItem.itemName, image: menuItem.image, foodType: menuItem.foodType,
        category: menuItem.category, price: menuItem.price, discount: menuItem.discount, quantity: menuItem.quantity + 1 };

        menuItem.quantity = item.quantity;
        
        let success = false;
        if(item.quantity >= 0){
            //update cart service
            success = await this.cartInformationService.cartOperations(item);

            //undo operation do not go to next step
            if(!success) {
                menuItem.quantity--;
                return;
            } else {
                //update menu in table
                this.modifyMenuItems(menuItem);
            }
            //console.log('Menu after add cart items: ',this.menus);
        }
    }

    removeMenuItem(menuItem:Menu) {
        let item: CartMenuItem = { menuId: menuItem.id,vendorId: menuItem.vendorId,itemName: menuItem.itemName, image: menuItem.image, foodType: menuItem.foodType,
        category: menuItem.category, price: menuItem.price, discount: menuItem.discount, quantity: menuItem.quantity - 1 };

        menuItem.quantity = item.quantity;

        if(item.quantity >= 0){

            if(item.quantity == 0){
                
                this.cartInformationService.removeItemCart(item);

            } else {

                //update cart service
                this.cartInformationService.cartOperations(item);

                //update menu in table
                this.modifyMenuItems(menuItem);
            }
            
            console.log('Menu after remove cart items: ',this.menus);
        }
    }

    modifyMenuItems(menuItem:Menu){
        this.menus = this.menus.map(item=> (item.id === menuItem.id)? {...item,quantity: menuItem.quantity} : {...item});
    }
}