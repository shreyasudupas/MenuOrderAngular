import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { environment } from 'src/environments/environment';
import { ImageData } from 'src/app/admin/components/menu-image-details/image-response';

@Component({
    selector: 'image-selection-list',
    templateUrl: './image-selection-list.component.html'
})

export class ImmageSelectionListComponent extends BaseComponent<ImageData> implements OnInit{
    @Input() itemName:string = '';
    imageList:ImageData[] = [];
    selectedItem!:ImageData|null;
    @Output() sendImageSelection = new EventEmitter();
    @Input() alreadySelectedImageId:string='';
    @Output() sendDialogClose = new EventEmitter();

    constructor(
        public menuService:MenuService,
        public override httpclient:HttpClient,
        public commonBroadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        private router:Router,
        private fb: FormBuilder,
        messageService: MessageService){
            super(menuService,httpclient,commonBroadcastService,messageService)
    }

    
    ngOnInit(): void {

        this.callImageSelectionAPi();
    }

    callImageSelectionAPi = () => {
        this.baseUrl = environment.inventory.imageMenu;
        this.action = "search";
        let params = new HttpParams()
            .append('searchParam',this.itemName);
        this.ListItems(params).subscribe({
            next: result => {
                //console.log(result);
                if(result!=null)
                    this.imageList = result;

                    let imageItem = this.imageList.find(i=>i.id == this.alreadySelectedImageId);
                    if(imageItem !== undefined){
                        this.selectedItem = imageItem;
                    }
            },
            error: error => {
                console.log(error);
            }
        });
    }

    onRowUnselect = ($event:any) => {
        //console.log(JSON.stringify($event));
        this.selectedItem = null;
    }

    onRowSelect = ($event:any) => {
        this.selectedItem = {
            id: $event.data.id,
            itemName: $event.data.itemName,
            active: $event.data.active,
            data: $event.data.data,
            description: $event.data.description
        };
    }

    updateImage = () => {

        this.sendImageSelection.emit(this.selectedItem);
        this.sendDialogClose.emit(false);
    }
    
}