import { Injectable } from '@angular/core';
import { MenuActiveItem, MenuNavigationModel } from '../models/menuModel';
import { AuthService } from './auth.service';

@Injectable({
    'providedIn':'root'
})

export class MenuService{

    constructor(private authService:AuthService){
    }

    menu!: MenuActiveItem;

    getActiveMenuItemInTheList(componentName:any):MenuActiveItem {
        
        if(componentName != null){
            let name:string = componentName;
            var getFirstName = name.split(/(?=[A-Z])/);

            //compare the name with the first name
            var role = this.authService.GetUserRole();
            let menuTempList: MenuNavigationModel[] = this.getMenuItemList();
            
            var findParentMenuListId = menuTempList.findIndex(item => item.parent == role);

                if(findParentMenuListId > -1){
                    let componentName:string;

                    if(getFirstName.length > 2){
                        componentName = getFirstName[0] + getFirstName[1];
                    }else{
                        componentName = getFirstName[0];
                    }

                    //compare first name of the component and label
                    var CurrentMenuId = menuTempList[findParentMenuListId].items.findIndex(item => item.label == componentName);
    
                    if(CurrentMenuId > -1){
                        menuTempList[findParentMenuListId].items[CurrentMenuId].visible = true;
    
                        this.menu = {
                            activeMenu : menuTempList[findParentMenuListId].items[CurrentMenuId],
                            itemList : menuTempList[findParentMenuListId].items
                        };
    
                        return this.menu;
                    }
                    else{
                        //default to user home
                        this.menu = {
                            activeMenu : menuTempList[findParentMenuListId].items[0],
                            itemList : menuTempList[findParentMenuListId].items
                        };
    
                        return this.menu;
                    }
                } else {
                    //if profile doesnt match user or admin then default to home user
                    this.menu = {
                        activeMenu : menuTempList[0].items[0],
                        itemList : menuTempList[0].items
                    };
                    return this.menu;
                }   
        }else{
            this.defaultMenu();
        };
        return this.menu;
    }

    private defaultMenu = () => {
        let defaultMenu = [{label: 'Home', icon: 'pi pi-fw pi-home',routerLink: ['./home'],visible:true}];

        //default to user home
        this.menu = {
           activeMenu : defaultMenu[0],
           itemList : defaultMenu
       };
    }

    public getMenuItemList = ():MenuNavigationModel[] => {
        let menuList:MenuNavigationModel[] =  [
            {
                parent :'user',
                items : [
                    {
                        label: 'Home',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['./home']
                    },
                    {
                        label: 'Vendor',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink:['./vendorlist']
                    },
                    {
                        label: 'Menu', 
                        icon: 'pi pi-fw pi-calendar',
                        visible:false
                    },
                    {
                        label: 'Cart', 
                        icon: 'pi pi-fw pi-calendar',
                        visible:false
                    },
                    {
                        label: 'Profile', 
                        icon: 'pi pi-fw pi-pencil',
                        routerLink:['./user-profile']
                    },
                    {
                        label: 'Payment', 
                        icon: 'pi pi-fw pi-file',
                        routerLink:['./user-payment']
                    },
                    {
                        label: 'Settings', 
                        icon: 'pi pi-fw pi-cog'
                    }
                ]
            },
            {
                parent :'admin',
                items : [
                    {
                        label: 'Home',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['./home']
                    },
                    {
                        label: 'Vendor',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink:['./vendor']
                    },
                    {
                        label: 'VendorDetail',
                        icon: 'pi pi-fw pi-calendar',
                        visible: false
                    },
                    {
                        label: 'Settings', 
                        icon: 'pi pi-fw pi-cog'
                    }
                ]
            }
        ]; 

        return menuList;
    }
}