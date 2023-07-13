import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartInformationSerivice } from 'src/app/common/services/cart-information.service';
import { CartInformation } from '../cart-component/cart-information';

@Component({
    selector: 'cart-icon',
    templateUrl: './cart-icon.component.html',
    styleUrls: [ './cart-icon.component.css' ]
})

export class CartIconComponent implements OnInit{
noOfItems:string;

    constructor(public cartInformationService:CartInformationSerivice,
        public router:Router) { 
    }

    ngOnInit(): void {
        this.getNoOfItems();
    }

    getNoOfItems() {

        this.cartInformationService.getNumberOfItemsInCart().subscribe({
            next: result => {
                this.noOfItems = result.toString();
            },
            error: err => {
                console.log('Error in CartInfor Number of Items ',err)
            }
        });

        this.cartInformationService.getUserCartInformationFromAPI().subscribe({
            next: (result:CartInformation) => {
                let cartInformations = [];

                if(result !== null){
                    result.menuItems.map(cart=>{
                        cartInformations.push({
                            id: cart.menuId,
                            itemName: cart.itemName,
                            active: true,
                            price: cart.price,
                            image: cart.image,
                            category: cart.category,
                            discount: cart.discount,
                            foodType: cart.foodType,
                            quatity: cart.quantity,
                            rating: 0,
                            vendorId: cart.vendorId
                        });
                    });

                    this.cartInformationService.modifyCartItemsInCart(result);
                    //console.log('Cart Information result: ',this.cartInformations);
                } else {
                    this.cartInformationService.initializeUserCartInformation();
                }
            },
            error: err => {
                console.log('Error occurred in Get CartInformation ',err);
            }
        });
    }

    goToCartPage() {
        this.router.navigateByUrl('user/cart');
    }

}