import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuActiveItem, MenuNavigationModel } from '../models/menuModel';
import { AuthService } from './auth.service';
import { UserDataSharingService } from './user-datasharing.service';
import { NavigationService } from './navigation.service';

@Injectable({
    'providedIn':'root'
})

export class MenuService{

    constructor(private authService:AuthService,
        private userSharingService:UserDataSharingService,
        public navigation:NavigationService){
    }

    menu!: MenuActiveItem;

    public async getMenuItemList() :Promise<MenuNavigationModel[]> {
        let vendorId = await this.vendorIdPromise();

        let menuList:MenuNavigationModel[] =  [
            {
                parent :'user',
                items : [
                    {
                        label: 'Home',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['./home'],
                        componentName:'UserHomeComponent',
                        visible:true,
                        routeName:'user/home',
                        routerLinkActiveOptions: { exact:true }
                    },
                    {
                        label: 'Food',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['./food'],
                        componentName:'FoodComponent',
                        visible:true,
                        routeName:'user/food',
                        routerLinkActiveOptions: { exact:true }
                    },
                    {
                        label: 'Menu',
                        icon: 'pi pi-fw pi-home',
                        routerLink: [''],
                        componentName:'MenuComponent',
                        visible:false,
                        routeName:'user/food/menu',
                        routerLinkActiveOptions: { exact:true }
                    },
                    {
                        label: 'Cart',
                        icon: 'pi pi-fw pi-shopping-cart',
                        routerLink: [''],
                        componentName:'CartComponent',
                        visible:false,
                        routeName:'user/cart',
                        routerLinkActiveOptions: { exact:true }
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
                        visible:true,
                        routerLinkActiveOptions: { exact:true },
                        routeName:'admin/home'
                    },
                    {
                        label: 'Vendor',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink:['./vendor'],
                        componentName:'VendorComponent',
                        visible:true,
                        routeName:'admin/vendor',
                        routerLinkActiveOptions: { exact:true }
                    },
                    {
                        label: 'VendorDetail',
                        icon: 'pi pi-fw pi-calendar',
                        visible: false,
                        componentName:'VendorDetailComponent',
                        routerLink:[''],
                        routeName:'/admin/vendor-details',
                        routerLinkActiveOptions: { exact:true }
                    },
                    {
                        label: 'Menu Details',
                        icon: 'pi pi-fw pi-calendar',
                        visible: false,
                        componentName:'MenuDetailsComponent',
                        routerLink:null,
                        routeName:'admin/menu-details',
                        routerLinkActiveOptions: { exact:true }
                    },
                    {
                        label: 'CategoryDetail',
                        icon: 'pi pi-fw pi-calendar',
                        visible:false,
                        componentName:'CategoryDetailComponent',
                        routerLink:null,
                        routeName:'/category-details',
                        routerLinkActiveOptions: { exact:true }
                    },
                    {
                        label: 'Food Type',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink:['./food-type-list'],
                        componentName:'FoodTypeComponent',
                        visible:true,
                        routeName:'admin/food-type-list',
                        routerLinkActiveOptions: { exact:true }
                    },
                    {
                        label: 'Food Type Details',
                        icon: 'pi pi-fw pi-calendar',
                        visible: false,
                        componentName:'FoodTypeDetailsComponent',
                        routerLink:null,
                        routeName:'/food-types',
                        routerLinkActiveOptions: { exact:true }
                    },
                    {
                        label: 'Cuisine List',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink:['./cuisine-list'],
                        componentName:'CuisineListDetails',
                        visible:true,
                        routeName:'admin/cuisine-list',
                        routerLinkActiveOptions: { exact:true }
                    },
                    {
                        label: 'Image List',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink:['./image-menu-list'],
                        componentName:'MenuImageListComponent',
                        visible:true,
                        routeName:'admin/image-menu-list',
                        routerLinkActiveOptions: { exact:true }
                    },
                    {
                        label: 'Image Details',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink:null,
                        componentName:'MenuImageDetailsDashboardComponent',
                        visible:false,
                        routeName:'/menu-details',
                        routerLinkActiveOptions: { exact:true }
                    },
                    {
                        label: 'Cuisine Type Details',
                        icon: 'pi pi-fw pi-calendar',
                        visible: false,
                        componentName:'CuisineDetailsComponent',
                        routerLink:null,
                        routeName:'/cuisine-details',
                        routerLinkActiveOptions: { exact:true }
                    },
                    {
                        label: 'Invite User To Vendor',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink:['./invite-user-to-vendor'],
                        componentName:'InviteUserToVendorComponent',
                        visible:true,
                        routeName:'admin/invite-user-to-vendor',
                        routerLinkActiveOptions: { exact:true }
                    }
                ]
            },
            {
                parent :'vendor',
                items : [
                    {
                        label: 'Home',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['./home'],
                        componentName:'VendorHomeComponent',
                        visible:true,
                        routeName:'vendor/home',
                        routerLinkActiveOptions: { exact:true }
                    },
                    {
                        label: 'VendorDetail',
                        icon: 'pi pi-fw pi-calendar',
                        visible: true,
                        componentName:'VendorDetailComponent',
                        routerLink:['./vendor-detail/' + vendorId ],
                        routeName:'vendor/vendor-detail',
                        routerLinkActiveOptions: { exact:true }
                    },
                    {
                        label: 'CategoryDetail',
                        icon: 'pi pi-fw pi-calendar',
                        visible:false,
                        componentName:'CategoryDetailComponent',
                        routerLink:null,
                        routeName:'/category-details',
                        routerLinkActiveOptions: { exact:true }
                    },
                ]
            }
        ]; 

        return menuList;
    }

    async getActiveMenuItemInTheList(componentName: any): Promise<MenuActiveItem> {

        //compare the name with the first name
        var role = this.authService.GetUserRole();
        let menuTempList: MenuNavigationModel[] = await this.getMenuItemList();

        var findParentMenuListId = menuTempList.findIndex(item => item.parent == role);
        let menuLists: MenuItem[] = menuTempList[findParentMenuListId].items.map((menuItem) => {
            let item: MenuItem = {
                label: menuItem.label,
                icon: menuItem.icon,
                routerLink: menuItem.routerLink,
                visible: menuItem.visible,
                command: ()=> this.navigation.startSaveHistory(menuItem.routeName)
            };
            return item;
        });

        if (findParentMenuListId > -1) {

            //compare first name of the component and label
            var CurrentMenuId = menuTempList[findParentMenuListId].items.findIndex(item => item.componentName == componentName);

            if (CurrentMenuId > -1) {
                let currentMenuItem = menuTempList[findParentMenuListId].items[CurrentMenuId];
                menuLists = menuLists.map(menu => menu.label == currentMenuItem.label ? 
                    { label: menu.label, icon: menu.icon, routerLink: menu.routerLink, visible: true,routerLinkActiveOptions: { exact:true } } : { ...menu });


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
        let defaultMenu = [{label: 'Home', icon: 'pi pi-fw pi-home',routerLink: ['./home'], visible:true}];

        //default to user home
        this.menu = {
           activeMenu : defaultMenu[0],
           itemList : defaultMenu
       };
    }

    public vendorIdPromise():Promise<string> {
        return new Promise((resolve,reject)=>{
            this.userSharingService.getVendorId().subscribe((result)=>{
                if(result !== null && result !== undefined){
                    resolve(result);     
                }
            },(err)=>{
                console.log(err);
                reject(err);
            });
        });
    }

    public getVendorId() {
        let result:string='';

        this.vendorIdPromise().then((res)=>{
            result = res;
        }).catch(err=>console.log(err));

        return result;
    }
}