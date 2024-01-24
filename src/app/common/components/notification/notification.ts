export interface Notification{
    id:string;
    title:string;
    description:string;
    fromUserId:string;
    toUserId:string;
    role:string;
    recordedTimeStamp:string;
    link:string;
    sendAll:boolean;
    read:boolean;
}