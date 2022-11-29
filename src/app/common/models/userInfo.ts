export interface UserInfo{
    userId:string;
    userName:string;
    email:string;
    phoneNumber:string;
    imagePath:string;
    points:bigint;
    cartAmount:number;
    address:UserAddress[];
}

export interface UserAddress{
    //userAddressId:bigint;
    id:bigint;
    fullAddress:string;
    city:string;
    cityId:number;
    state:string;
    stateId:number;
    area:string;
    areaId:number;
    isActive:boolean;
}