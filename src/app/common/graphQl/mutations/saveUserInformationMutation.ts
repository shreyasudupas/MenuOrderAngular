import { gql } from "apollo-angular";

export interface SaveUserInformationData{
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
    }
}

export const SAVE_USERINFO = gql`
mutation ModifyUserInformation($saveUser:UserInput!){
    modifyUserInformation(userInfoInput: $saveUser){
        result
    }
}
`