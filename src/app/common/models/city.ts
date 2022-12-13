import { LocationArea } from "./locationArea";

export interface City{
    id:number;
    name:string;
    stateId:number| null;
    areas:LocationArea[];
}