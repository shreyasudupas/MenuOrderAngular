export interface UserProfileInfo {
    id: string;
    userName:string;
    userType:string;
    imagePath:string;
    cartAmount:number;
    points: number;
    email:string;
    emailConfirmed:boolean;
    phoneNumber:string;
    phoneNumberConfirmed:boolean;
    enabled:boolean;
}