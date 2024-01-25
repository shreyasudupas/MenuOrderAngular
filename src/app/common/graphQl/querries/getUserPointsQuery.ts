import { gql } from "apollo-angular";

export const GET_USER_CURRENT_POINTS = gql`
query GetCurrentUserEvent($userId:String) {
    currentUserPointsEvent(userId:$userId) {
      pointsInHand
    }
}`;

export interface UserPointsVariable {
    userId:string;
}

export interface UserPointsResponse {
    currentUserPointsEvent: UserPointsEventModel;
}

export interface UserPointsEventModel {
    eventId:string;
    userId:string;
    pointsInHand:number;
    pointsAdjusted:number;
    eventOperation:string;
    addOrAdjustedUserId:string;
    eventCreatedDate:Date;
}