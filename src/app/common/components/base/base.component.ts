import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
import { Observable } from "rxjs";
import { MenuActiveItem } from "../../models/menuModel";
import { ResourceServiceForkRequest } from "../../models/resourceServiceForkRequest";
import { CommonDataSharingService } from "../../services/common-datasharing.service";
import { MenuService } from "../../services/menu.service";
import { ResourceService } from "../../services/resource.service";
import { UserDataSharingService } from "../../services/user-datasharing.service";

export class BaseComponent<T> extends ResourceService<T>{

    public componentName:any;
    private activeMenuList!:MenuActiveItem;
    
    public action!:string | null;
    public baseUrl!:string;
    

    constructor(public _menuService:MenuService,
        public override httpclient:HttpClient,
        public _commonBroadcastService:CommonDataSharingService,
        public messageService:MessageService){
        super(httpclient);
        
    }

    public InitilizeMenu(){
        //get menu list
        this.activeMenuList = this._menuService.getActiveMenuItemInTheList(this.componentName);

        //send updated list to component
        this._commonBroadcastService.sendUpdatedMenuList(this.activeMenuList);

    }

    public getForkItems(request:ResourceServiceForkRequest):Observable<any[]>{
        return this.getItemsByFork(request);
    }

    public ListItems(params:HttpParams):Observable<T[]> {   
        //console.log(this.action , this.versionUrl) ;
        if(this.baseUrl == undefined || this.action == null){
            this.requestUri = this.baseUrl;
        }
        else{
            this.requestUri = this.baseUrl + '/' + this.action;
        }
        
        return this.listItems(params);
    }

    public Create(body:any):Observable<T>{
        
        if(this.action == undefined || this.action == null){
            this.requestUri = this.baseUrl;
        }
        else{
            this.requestUri = this.baseUrl + '/' + this.action;
        }
        return this.createItem(body);
    }

    public GetItem(param:HttpParams):Observable<T>{
        
        if(this.action == undefined || this.action == null){
            this.requestUri = this.baseUrl;
        }
        else{
            this.requestUri = this.baseUrl + '/' + this.action;
        }
        return this.getItem(param);
    }

    public UpdateItem(body:any){
        if(this.action == undefined || this.action == null){
            this.requestUri = this.baseUrl;
        }
        else{
            this.requestUri = this.baseUrl + '/' + this.action;
        }

        return this.updateItem(body);
    }

    public delete(queryParams: HttpParams): Observable<T> {
        if(this.action == undefined || this.action == null){
            this.requestUri = this.baseUrl;
        }
        else{
            this.requestUri = this.baseUrl + '/' + this.action;
        }
        return this.deleteItem(queryParams);
    }

    showInfo(message:string) {
        this.messageService.add({severity:'info', summary: 'Info', detail: message });
    }

    showError(message:string) {
        this.messageService.add({severity:'error', summary: 'Error', detail: message });
    }
}