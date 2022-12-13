export class ResourceServiceForkRequest{
    requestParamter:RequestResource[];
    
    constructor(){
        this.requestParamter = []
    }
}

export interface RequestResource{
    requestUrl:string;
    httpMethod:string;
    body?:any;
}