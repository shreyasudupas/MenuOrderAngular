export class SearchLocationResponse{
place_id:number;
lat:number;
lon:number;
name:string;
display_name:string;
osm_id:number;
address:AdressLocationModel;
}

export interface AdressLocationModel {
    road:string;
    suburb:string;
    city:string;
}