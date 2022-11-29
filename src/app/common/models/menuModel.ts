import { MenuItem } from "primeng/api";

export interface MenuNavigationModel{
    items:MenuItem[];
    parent:string;
}

export interface MenuActiveItem{
    activeMenu:MenuItem;
    itemList:MenuItem[];
}