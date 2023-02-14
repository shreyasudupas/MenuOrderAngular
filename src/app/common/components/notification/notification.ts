export interface Notification{
    id:string;
    title:string;
    description:string;
    userId:string;
    role:string;
    recordedTimeStamp:string;
    link:string;
    sendAll:boolean;
    read:boolean;
}