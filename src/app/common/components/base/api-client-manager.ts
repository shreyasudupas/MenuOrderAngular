import { Observable } from "rxjs";
import { ResourceService } from "../../services/resource.service";
import { NotificationDataRequestType } from "../notification/notification";

export class ApiClientManager<TData> extends ResourceService<TData> {

    callApiWithBody<TBody>(operation:string,body:TBody) : Observable<TBody> {
        switch(operation) {
            case NotificationDataRequestType.Post: 
                        return this.postApiClient(body);
            case NotificationDataRequestType.Patch: 
                        return this.patchApiClient(body);
            default : throw Error("operation is incorrect or not implemented");
        }
    }
}