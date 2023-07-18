import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CartInformationSerivice } from 'src/app/common/services/cart-information.service';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { NavigationService } from 'src/app/common/services/navigation.service';
import { CartInformation, CartMenuItem } from './cart-information';

@Component({
    selector: 'cart-component',
    templateUrl:'./cart.component.html',
    styleUrls: [ './cart.component.scss' ]
})

export class CartComponent extends BaseComponent<any> implements OnInit {
cartInformations:CartMenuItem[];
totalPrice:number;

    constructor(
        public menuService:MenuService,
        public override httpclient:HttpClient,
        public commonBroadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        private router:Router,
        messageService: MessageService,
        public navigation:NavigationService,
        public cartInformationService:CartInformationSerivice){
            super(menuService,httpclient,commonBroadcastService,messageService)
    }

    ngOnInit(): void {
        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;

        this.InitilizeMenu();

        this.getCartInformation();
    }

    getCartInformation(){
        this.cartInformationService.getUserCartInformationFromAPI().subscribe({
            next: result => {

                if(result === null){
                    this.cartInformationService.initializeUserCartInformation();
                } else {
                    this.cartInformations = result.menuItems;

                    if(this.cartInformations.length > 0){
                        this.totalPrice = this.cartInformations.reduce(function(prevValue,currentValue){
                            return prevValue + currentValue.price;
                        },0);
                    }
                }
            }
        });
    }

    goToMenuPage(){
        let menu = this.cartInformations.find(x=>x.vendorId); //get first object

        if(menu !== undefined){
            let url = 'user/menu/' + menu.vendorId;
            return this.router.navigateByUrl(url);
        }
        return null;
    }

    addMenuItem(menuItem:CartMenuItem) {
        menuItem.quantity = menuItem.quantity + 1;

        this.cartInformationService.modifyMenuCart(menuItem);
    }

    removeMenuItem(menuItem:CartMenuItem) {
        menuItem.quantity = menuItem.quantity - 1;

        if(menuItem.quantity >= 0){

            if(menuItem.quantity == 0){
                this.cartInformationService.removeItemCart(menuItem);

                this.cartInformations = this.cartInformations.filter(c=>c.menuId !== menuItem.menuId);
            } else {
                //update cart service
                this.cartInformationService.modifyMenuCart(menuItem);
            }
        }
    }
}