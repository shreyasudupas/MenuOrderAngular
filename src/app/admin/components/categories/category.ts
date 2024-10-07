export interface Category {
    id:number;
    name:string;
    description:string | null;
    openTime:string;
    closeTime:string;
    active:boolean;
    releaseDateTime:Date;
}