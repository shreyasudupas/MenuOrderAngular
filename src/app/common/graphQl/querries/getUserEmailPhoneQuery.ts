import { gql } from "@apollo/client";

export const GET_USER_PHONE_EMAIL = gql`
query GetUserEmailPhone($userId:String!){
    userInformation (userId:$userId) {
      email
      phoneNumber
      phoneNumberConfirmed
    }
}`;