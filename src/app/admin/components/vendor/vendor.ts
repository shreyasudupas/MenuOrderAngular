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
    image:ImageModel;
    vendorType:string;
    registrationProcess:string;
}

export interface Coordinate{
    latitude:number;
    longitude:number;
}

export class ImageModel{
    imageId:string;
    imageFileName:string;
}

export enum RegistrationProgressEnum {
    Filled,
    InProgress,
    PartiallyCompleted,
    Completed
}