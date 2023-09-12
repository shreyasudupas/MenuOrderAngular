import { gql } from "apollo-angular";

export interface UserClaimModel {
userId:string;
claimType:string;
claimValue:string;
}

export interface AddUserClaimResponse {
    addUserClaim:UserClaimModel;
}

export interface AddUserClaimInput {
    userClaim : {
        userId:string;
        claimType:string;
        claimValue:string;
    }
}

export const ADD_USERCLAIM = gql`
mutation AddUserClaim($userClaim:UserClaimModelInput){
    addUserClaim(userClaimModel: $userClaim) {
      userId
      claimType
      claimValue
    }
}
`;