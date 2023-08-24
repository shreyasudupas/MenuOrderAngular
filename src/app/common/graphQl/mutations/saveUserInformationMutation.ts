import { gql } from "apollo-angular";

export interface SaveUserInformationData{
    result:boolean;
}

export interface SaveUserInfoVariables{
    saveUser:{
        id:string;
        userName:string;
        email:string;
        cartAmount:number;
        points:number;
        isAdmin:boolean;
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