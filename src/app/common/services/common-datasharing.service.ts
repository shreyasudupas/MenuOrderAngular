import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { MenuActiveItem } from "../models/menuModel";
import { UserInfo } from "../models/userInfo";

@Injectable({
 providedIn:'root'
})

export class CommonDataSharingService{

    ///////////////////////////////////////////////////////
    //assign default menuList options
    private menuList = new BehaviorSubject<MenuActiveItem|null>(null);

    getActiveMenuList():Observable<MenuActiveItem | null>{
        return this.menuList.asObservable();
    }

    sendUpdatedMenuList(updatedList:MenuActiveItem){
        this.menuList.next(updatedList);
    }
    ///////////////////////////////////////////////////////

    //userProfile
    private userProfile = new BehaviorSubject<UserInfo|null>(null);

    getCurrentUserInfo(){
        return this.userProfile.asObservable();
    }
    
    updateUserInfo(value:UserInfo){
        this.userProfile.next(value);
    }
 
   ///////////////////////////////////////////////////////
}