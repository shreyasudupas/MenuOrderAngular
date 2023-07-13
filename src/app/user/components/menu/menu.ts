import { ImageModel } from "src/app/admin/components/vendor/vendor";

export class Menu {
    id:string;
    vendorId:string;
    itemName:string;
    image:ImageModel;
    foodType:string;
    category:string;
    price:number;
    discount:number;
    rating:number;
    active:boolean;
    quantity:number;
}