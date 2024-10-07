export interface VendorCategoryMenu {
    id:string;
    vendorName:string;
    categories:CategoryVendor;
}

export interface CategoryVendor {
    id:string;
    name:string;
    description:string;
    openTime:string;
    closeTime:string;
    active:boolean;
    releaseDate:Date;
    menuLists: CategoryMenuItem[];
}

export interface CategoryMenuItem {
    id:string;
    categoryId:string;
    itemName:string;
    imageId:string;
    imageFilename:string;
    imageData:string;
    imageName:string;
    foodType:string;
    price:number;
    discount:number;
    rating:number;
    active:boolean;
}