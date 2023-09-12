import { gql } from "apollo-angular";

export interface UserClaimModel {
userId:string;
claimType:string;
claimValue:string;
}

export interface ModifyUserClaimResponse {
    addUserClaim:UserClaimModel;
}

export interface ModifyUserClaimInput {
    modifyUserClaim : {
        userId:string;
        claimType:string;
        claimValue:string;
    }
}

export const ADD_USERCLAIM = gql`
mutation ModifyUserClaim($userClaim:UserClaimModelInput){
    modifyUserClaim(userClaimModel: $userClaim) {
      userId
      claimType
      claimValue
    }
}
`;