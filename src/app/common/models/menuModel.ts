import { MenuItem } from "primeng/api";

export interface MenuNavigationModel{
    //items:MenuItem[];
    items:MenuItemModel[];
    parent:string;
}

export interface MenuActiveItem{
    activeMenu:MenuItem;
    itemList:MenuItem[];
}

//customized MenuItem
export interface MenuItemModel{
    label:string;
    icon:string;
    componentName:string;
    routerLink:any;
    visible:boolean;
    routeName:string;
    routerLinkActiveOptions:any;
}