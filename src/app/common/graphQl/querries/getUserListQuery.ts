import { gql } from "apollo-angular";
import { UserProfileInfo } from "../../components/user-profile/userProfile";

export const GET_USER_LIST_INFO = gql`
query UserList {
    userList {
      id
      fullname
      userName
      userType
    }
  }`;

export interface UserListInfoResponse {
    userList:UserProfileInfo[];
}