import { MailBody } from "./mailBody";

export interface WelcomeVendorModel extends MailBody{
    vendorName:string;
    vendorEmail:string;
    username:string;
}