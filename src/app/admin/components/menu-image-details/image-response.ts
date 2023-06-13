export interface ImageResponse{
    totalRecord:number;
    imageData:ImageData[];
}

export interface ImageData{
    id:string;
    itemName:string;
    fileName:string;
    data:string;
    active:boolean;
    description:string;
}