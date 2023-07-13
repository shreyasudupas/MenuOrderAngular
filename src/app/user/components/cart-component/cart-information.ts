import { ImageModel } from 'src/app/admin/components/vendor/vendor';

export class CartInformation {
    id:string;
    userId:string;
    menuItems:CartMenuItem[];
    cartStatus:string;
}

export class CartMenuItem{
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