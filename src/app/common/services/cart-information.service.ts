import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartInformation, CartMenuItem } from 'src/app/user/components/cart-component/cart-information';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
    providedIn:'root'
})

export class CartInformationSerivice {
    private totalQuantity:number = 0;
    private numberOfCartItems = new BehaviorSubject<number>(0);
    private cartInfo:CartInformation;
    //private cartInformation = new BehaviorSubject<CartInformation>(null);

    constructor(private http: HttpClient,
        public authService:AuthService) {}

    public getNumberOfItemsInCart() {
        return this.numberOfCartItems.asObservable();
    }

    public modifyItemsInCart(itemNo:number){
        this.numberOfCartItems.next(itemNo);
    }

    public modifyCartItemsInCart(cartItems:CartInformation){
        this.cartInfo = cartItems;
        //this.cartInformation.next(this.cartInfo);
        this.updatedItemNumber();
    }

    public getUserCartInformationFromAPI(): Observable<CartInformation> {
        let user = this.authService.getUserInformation();
        let userId = user.profile['userId'];
        //console.log('UserId is ',userId);

        let url = environment.orderService.cartInformation;
        let httpParam = new HttpParams().set('userId',userId);

        return this.http.get<CartInformation>(url,{params: httpParam});
    }

    // public getCartInformation(){
    //     return this.cartInformation.asObservable();
    // }

    public getAllCartInfo(){
        return this.cartInfo;
    }

    public modifyMenuCart(menuItem: CartMenuItem) {
        if(this.cartInfo.menuItems.length == 0){
            this.addMenuCartItems(menuItem);
        }else if(this.cartInfo.menuItems.findIndex(m=>m.menuId == menuItem.menuId) > -1) {
            this.updateCartMenuItems(menuItem);
        }else {
            this.addMenuCartItems(menuItem);
        }

        console.log('Cart Information: ',this.cartInfo);
    }

    public addMenuCartItems(menuItem: CartMenuItem) {
        this.cartInfo.menuItems = [...this.cartInfo.menuItems, menuItem];

        this.updateMenuItemsInCart();
        this.updatedItemNumber();
    }

    public updateCartMenuItems(menuItem: CartMenuItem){
        this.cartInfo.menuItems = this.cartInfo.menuItems.map(item=> (item.menuId === menuItem.menuId)? {...item,quatity: menuItem.quantity} : {...item});

        this.updateMenuItemsInCart();
        this.updatedItemNumber();
    }

    public removeItemCart(menuItem: CartMenuItem){
        this.cartInfo.menuItems = this.cartInfo.menuItems.filter(item=> item.menuId !== menuItem.menuId);

        this.updateMenuItemsInCart();
        this.updatedItemNumber();
    }

    public updatedItemNumber(){

        this.totalQuantity = this.cartInfo.menuItems.reduce(function(prevValue,currentValue){
            return prevValue + currentValue.quantity;
        },0);

        this.modifyItemsInCart(this.totalQuantity);
    }

    public initializeUserCartInformation(){
        let user = this.authService.getUserInformation();
        let userId = user.profile['userId'];
        let url = environment.orderService.cartInformation;
        let body:CartInformation = {
            id:null,
            cartStatus:"Active",
            userId: userId,
            menuItems:[]
        };

        this.http.post<CartInformation>(url,body).subscribe({
           next: result => {
                if(result !== null){
                    this.cartInfo = result;
                    //this.cartInformation.next(this.cartInfo);

                    console.log('Cart Items are initilised');
                }
           },
           error: err => {
            console.log('Error Occured in Cart Initiise Operation ',err);
           }
        });
    }

    public updateMenuItemsInCart(){
        let url = environment.orderService.cartInformation;

        this.http.put<CartInformation>(url,this.cartInfo).subscribe({
            next: result => {
                 if(result !== null){
                     this.cartInfo = result;
                     //this.cartInformation.next(this.cartInfo);
 
                     console.log('Cart Items are Updated');
                 }
            },
            error: err => {
             console.log('Error Occured in Cart Update Operation ',err);
            }
         });
    }
}