import { gql } from "apollo-angular";

export interface SaveUserInformationResponse{
    modifyUserInformation:modifyUserInformation;
}

interface modifyUserInformation {
    result:boolean;
}

export interface SaveUserInfoVariables{
    saveUser:{
        id:string;
        userName:string;
        email:string;
        emailConfirmed:boolean;
        cartAmount:number;
        points:number;
        phoneNumber:string;
        phoneNumberConfirmed:boolean;
        enabled:boolean;
        userType:string;
    }
}

export const SAVE_USERINFO = gql`
mutation ModifyUserInformation($saveUser:UserInput!){
    modifyUserInformation(userInfoInput: $saveUser){
        result
    }
}
`