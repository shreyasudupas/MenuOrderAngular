import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { UserInfo } from "../models/userInfo";


@Injectable({
 providedIn:'root'
})

export class UserDataSharingService{
    
    constructor() { }

 //cart count
 private itemsAddedToCartCount = new BehaviorSubject<number>(0);

  getCurrentCartCount():Observable<number>{
    return this.itemsAddedToCartCount.asObservable();
  }

  updateCartCount(flag:boolean){
    var currentCount = this.itemsAddedToCartCount.getValue();
    if(flag==true){ //to increase the count
      currentCount+=1;
    }
    else  //to decrease the count
      currentCount-=1;

    this.itemsAddedToCartCount.next(currentCount);
  }
  updateCartCountWithvalue(value:number){
    this.itemsAddedToCartCount.next(value);
  }
  ///////////////////////////////////////////////////////////

  //Add the Location/Locality
  private userLocation = new BehaviorSubject<string>('');

  updateUserLocality(location:string){
    this.userLocation.next(location);
  }

  getUserLocality():Observable<string>{
    return this.userLocation.asObservable();
  }

  ///////////////////////////////////////////////////////
}