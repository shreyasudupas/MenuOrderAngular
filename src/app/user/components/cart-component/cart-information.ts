import { ImageModel } from 'src/app/admin/components/vendor/vendor';
import { Menu as MenuModel } from 'src/app/user/components/menu/menu'

export class CartInformation extends MenuModel {
    quatity:number;
}

export class CartInformationAPIModel{
    id:string;
    userId:string;
    menuItems:CartMenuItem[];
    cartStatus:string;
}

class CartMenuItem{
    menuId:string;
    vendorId:string;
    itemName:string;
    image:ImageModel;
    foodType:string;
    category:string;
    price:number;
    discount:number;
    quantity:number;
}