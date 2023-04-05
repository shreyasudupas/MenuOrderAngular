import { EmailTypeEnum } from "../enums/emailenum";

export interface MailBody{
    toAddress:string;
    subject:string;
    body:string;
    templateType:EmailTypeEnum;
}