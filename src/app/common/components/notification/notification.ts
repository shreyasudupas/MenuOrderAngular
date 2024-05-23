export interface Notification{
    id:string;
    priority:string;
    title:string;
    description:string;
    fromUserId:string;
    toUserId:string;
    role:string;
    data:NotificationData;
    sendAll:boolean;
    read:boolean;
    createdDate:string;
}

export interface NotificationData {
    uri:string;
    requestType:string;
    body:string;   
}

export enum NotificationPriority {
    Low = "low",
    Medium = "medium",
    High = "high"
}

export enum NotificationDataRequestType {
    Get = "get",
    Post = "post",
    Put = "put",
    Delete = "delete",
    Patch = "patch"
}