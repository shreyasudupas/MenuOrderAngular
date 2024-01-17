export interface VendorUserIdMapping{
    id:number;
    userId:string;
    username:string;
    vendorId:string;
    emailId:string;
    enabled:boolean;
    userType:VendorUserType;
}


export enum VendorUserType {
    VendorAdmin = 1,  //Main Vendor
    VendorUser = 2 //Users under Vendor
}

export interface VendorUserMappingEnableResponse {
    vendorId:string;
    isVendorPresent:boolean;
    isEnabled:boolean
}