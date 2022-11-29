export class ResourceServiceForkRequest{
    requestParamter!:RequestResource[];
    
}

export interface RequestResource{
    requestUrl:string;
    httpMethod:string;
    body?:any;
}