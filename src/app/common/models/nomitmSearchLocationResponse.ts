export interface SearchLocationResponse{
placeId:number;
latitude:number;
longitude:number;
displayName:string;
address:AdressLocationModel;
}

export interface AdressLocationModel {
    road:string;
    suburb:string;
    city:string;
    state:string;
}