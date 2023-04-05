import { Category } from "../categories/category";

export interface Vendor{
    id:string;
    vendorName:string;
    vendorDescription:string;
    categories:Category[];
    cuisineType:string[];
    rating:number;
    state:string;
    city:string;
    area:string;
    coordinates:Coordinate;
    addressLine1:string;
    addressLine2:string;
    openTime:string;
    closeTime:string;
    active:boolean;
}

export interface Coordinate{
    latitude:number;
    longitude:number;
}