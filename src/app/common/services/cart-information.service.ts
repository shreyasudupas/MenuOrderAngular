import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
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
    private userId:string;
    //private cartInformation = new BehaviorSubject<CartInformation>(null);

    constructor(private http: HttpClient,
        public authService:AuthService) {
            let user = this.authService.getUserInformation();
            this.userId = user.profile['userId'];
        }

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
        
        //console.log('UserId is ',userId);

        let url = environment.orderService.cartInformation;
        let httpParam = new HttpParams().set('userId',this.userId);

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

    public async addMenuCartItems(menuItem: CartMenuItem) {
        this.cartInfo.menuItems = [...this.cartInfo.menuItems, menuItem];

        let success = await this.updateMenuItemsInCart(menuItem.vendorId);

        if(success){
            this.updatedItemNumber();
        }
    }

    public async updateCartMenuItems(menuItem: CartMenuItem){
        this.cartInfo.menuItems = this.cartInfo.menuItems.map(item=> (item.menuId === menuItem.menuId)? {...item,quantity: menuItem.quantity} : {...item});

        let success = await this.updateMenuItemsInCart(menuItem.vendorId);

        if(success){
            this.updatedItemNumber();
        }
    }

    public async removeItemCart(menuItem: CartMenuItem){
        this.cartInfo.menuItems = this.cartInfo.menuItems.filter(item=> item.menuId !== menuItem.menuId);

        let success = await this.updateMenuItemsInCart(menuItem.vendorId);

        if(success){
            this.updatedItemNumber();
        }
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

    public async updateMenuItemsInCart(vendorId:string){
        let success = true;
        let url = environment.orderService.cartInformation;

        //check if item belongs same vendor
        let menuItemBelongsTovendor$ = this.checkIfMenuItemBelongsToSameVendor(vendorId);
        let menuItemBelongsTovendor = await lastValueFrom(menuItemBelongsTovendor$);

        if(menuItemBelongsTovendor === true)
        {
            let cartUpdateResult$ = this.http.put<CartInformation>(url,this.cartInfo);
            this.cartInfo = await lastValueFrom(cartUpdateResult$).catch(err => {
                console.log('Error Occured in Cart Update Operation ',err);
                success = false;
                return null; //old value back
            });
        }
        else
        {
            success = false;
            alert("Menu Item doesnt belong to same vendor");
        }
        return success;
    }

    public checkIfMenuItemBelongsToSameVendor(vendorId:string){
        let url = environment.orderService.cartInformation + '/menuItems/isPresent?';
        let params = new HttpParams().set('userId',this.userId).set('vendorId',vendorId);

        return this.http.get<boolean>(url,{ params: params });
    }

    public async clearMenuItems() {
        let url = environment.orderService.cartInformation;
        let params = new HttpParams().set('userId',this.userId);

        let clearCart$ = this.http.delete<boolean>(url,{params: params});
        let clearCartResult = await lastValueFrom(clearCart$).catch(err=>{
            console.log('Error occured in Clearing Cart Menu Items',err);
            return false;
        });
        return clearCartResult;
    }
}