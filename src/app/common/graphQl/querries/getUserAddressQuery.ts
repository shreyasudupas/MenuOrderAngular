import { gql } from "apollo-angular";

export const GET_USER_ADDRESS_LIST = gql`
query GetUserAddressInformation($userId:String!){
    userInformation (userId:$userId){
      id
      userName
      address {
        id
        state
        city
        area
        fullAddress
        isActive
      }
    }
  }`

export interface UserAddressModel {
    id:string;
    userName:string;
    address: AddressModel[];
}

export interface AddressModel {
    id:string;
    state:string;
    city:string;
    area:string;
    fullAddress:string;
    isActive:boolean;
    latitude:number;
    longitude:number;
}

export interface UserAddressInformationResponse {
    userInformation: UserAddressModel;
}

export interface UserAddressInformationVariable {
    userId:string;
}