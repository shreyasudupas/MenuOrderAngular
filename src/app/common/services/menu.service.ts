import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuActiveItem, MenuNavigationModel } from '../models/menuModel';
import { AuthService } from './auth.service';

@Injectable({
    'providedIn':'root'
})

export class MenuService{

    constructor(private authService:AuthService){
    }

    menu!: MenuActiveItem;

    getActiveMenuItemInTheList(componentName: any): MenuActiveItem {

        //compare the name with the first name
        var role = this.authService.GetUserRole();
        let menuTempList: MenuNavigationModel[] = this.getMenuItemList();

        var findParentMenuListId = menuTempList.findIndex(item => item.parent == role);
        let menuLists: MenuItem[] = menuTempList[findParentMenuListId].items.map((menuItem) => {
            let item: MenuItem = {
                label: menuItem.label,
                icon: menuItem.icon,
                routerLink: menuItem.routerLink,
                visible: menuItem.visible
            };
            return item;
        });

        if (findParentMenuListId > -1) {

            //compare first name of the component and label
            var CurrentMenuId = menuTempList[findParentMenuListId].items.findIndex(item => item.componentName == componentName);

            if (CurrentMenuId > -1) {
                let currentMenuItem = menuTempList[findParentMenuListId].items[CurrentMenuId];
                menuLists = menuLists.map(menu => menu.label == currentMenuItem.label ? { label: menu.label, icon: menu.icon, routerLink: menu.routerLink, visible: true } : { ...menu });


                this.menu = {
                    activeMenu: menuLists[CurrentMenuId],
                    itemList: menuLists
                };

                return this.menu;
            } else {
                //default to user home
                this.menu = {
                    activeMenu: menuLists[0],
                    itemList: menuLists
                };

                return this.menu;
            }
        } else {
            this.defaultMenu();
            return this.menu;
        }
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
                        routerLink: ['./home'],
                        componentName:'HomeComponent',
                        visible:true
                    },
                    {
                        label: 'Vendor',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink:['./vendorlist'],
                        componentName:'VendorComponent',
                        visible:true
                    },
                    {
                        label: 'Menu', 
                        icon: 'pi pi-fw pi-calendar',
                        visible:false,
                        componentName:'MenuComponent',
                        routerLink:null
                    },
                    {
                        label: 'Cart', 
                        icon: 'pi pi-fw pi-calendar',
                        visible:false,
                        componentName:'MenuComponent',
                        routerLink:null
                    },
                    {
                        label: 'Profile', 
                        icon: 'pi pi-fw pi-pencil',
                        routerLink:['./user-profile'],
                        componentName:'',
                        visible:true
                    },
                    {
                        label: 'Payment', 
                        icon: 'pi pi-fw pi-file',
                        routerLink:['./user-payment'],
                        componentName:'MenuComponent',
                        visible:false
                    }
                ]
            },
            {
                parent :'admin',
                items : [
                    {
                        label: 'Home',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['./home'],
                        componentName:'HomeComponent',
                        visible:true
                    },
                    {
                        label: 'Vendor',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink:['./vendor'],
                        componentName:'VendorComponent',
                        visible:true
                    },
                    {
                        label: 'VendorDetail',
                        icon: 'pi pi-fw pi-calendar',
                        visible: false,
                        componentName:'VendorDetailComponent',
                        routerLink:['']
                    },
                    {
                        label: 'Menu Details',
                        icon: 'pi pi-fw pi-calendar',
                        visible: false,
                        componentName:'MenuDetailsComponent',
                        routerLink:null
                    },
                    {
                        label: 'CategoryDetail',
                        icon: 'pi pi-fw pi-calendar',
                        visible:false,
                        componentName:'CategoryDetailComponent',
                        routerLink:null
                    },
                    {
                        label: 'Food Type',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink:['./food-type-list'],
                        componentName:'FoodTypeComponent',
                        visible:true
                    },
                    {
                        label: 'Food Type Details',
                        icon: 'pi pi-fw pi-calendar',
                        visible: false,
                        componentName:'FoodTypeDetailsComponent',
                        routerLink:null
                    },
                    {
                        label: 'Cuisine List',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink:['./cuisine-list'],
                        componentName:'CuisineListDetails',
                        visible:true
                    },
                    {
                        label: 'Cuisine Type Details',
                        icon: 'pi pi-fw pi-calendar',
                        visible: false,
                        componentName:'CuisineDetailsComponent',
                        routerLink:null
                    }
                ]
            }
        ]; 

        return menuList;
    }
}