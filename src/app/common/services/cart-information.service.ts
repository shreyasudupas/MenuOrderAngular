import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartInformation, CartInformationAPIModel } from 'src/app/user/components/cart-component/cart-information';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
    providedIn:'root'
})

export class CartInformationSerivice {
    private totalQuantity:number = 0;
    private itemsInCart = new BehaviorSubject<number>(0);
    private items:CartInformation[]=[];
    private cartInformation = new BehaviorSubject<CartInformation[]>([]);

    constructor(private http: HttpClient,
        public authService:AuthService) {}

    public getNumberOfItemsInCart() {
        return this.itemsInCart.asObservable();
    }

    public modifyItemsInCart(itemNo:number){
        this.itemsInCart.next(itemNo);
    }

    public modifyCartItemsInCart(cartItems:CartInformation[]){
        this.items = cartItems;
        this.cartInformation.next(this.items);
        this.updatedItemNumber();
    }

    public getUserCartInformationFromAPI(): Observable<CartInformationAPIModel> {
        let user = this.authService.getUserInformation();
        let userId = user.profile['userId'];
        //console.log('UserId is ',userId);

        let url = environment.orderService.cartInformation;
        let httpParam = new HttpParams().set('userId',userId);

        return this.http.get<CartInformationAPIModel>(url,{params: httpParam});
    }

    public getCartInformation(){
        return this.cartInformation.asObservable();
    }

    public modifyMenuCart(menuItem: CartInformation) {
        if(this.items.length == 0){
            this.addMenuCart(menuItem);
        }else if(this.items.findIndex(m=>m.id == menuItem.id) > -1) {
            this.modifyCart(menuItem);
        }else {
            this.addMenuCart(menuItem);
        }

        console.log('Cart Information: ',this.items);
    }

    public addMenuCart(menuItem: CartInformation) {
        this.items = [...this.items, menuItem];

        this.updatedItemNumber();
    }

    public modifyCart(menuItem: CartInformation){
        this.items = this.items.map(item=> (item.id === menuItem.id)? {...item,quatity: menuItem.quatity} : {...item});

        this.updatedItemNumber();
    }

    public removeItemCart(menuItem: CartInformation){
        this.items = this.items.filter(item=> item.id !== menuItem.id);

        this.updatedItemNumber();
    }

    public updatedItemNumber(){

        this.totalQuantity = this.items.reduce(function(prevValue,currentValue){
            return prevValue + currentValue.quatity;
        },0);

        this.modifyItemsInCart(this.totalQuantity);
    }
}