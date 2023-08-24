import { gql } from "apollo-angular";
import { UserProfileInfo } from "../../components/user-profile/userProfile";

export const GET_USER_INFO = gql`
    query GetUserInformation($userId:String!){
      userInformation (userId:$userId){
        id
        userName
        imagePath
        imagePath
        userType
        cartAmount
        points
        email
        emailConfirmed
        phoneNumber
        phoneNumberConfirmed
        enabled
      }
    }
    `

export interface UserInfoResponse{
     userInformation:UserProfileInfo;
}
      
export interface UserInfoVariable{
    userId: string;
}