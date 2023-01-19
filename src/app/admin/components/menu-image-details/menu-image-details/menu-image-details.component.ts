import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { environment } from 'src/environments/environment';
import { ImageData } from 'src/app/admin/components/menu-image-details/image-response'

@Component({
    selector: 'menu-image-details',
    templateUrl: './menu-image-details.component.html'
})

export class MenuImageDetailsComponent extends BaseComponent<ImageData> implements OnInit {
    header:string = '';
    
    @Input() menuImageId:string='';
    @Input() menuDetailForm!:FormGroup;
    @Output() activeItem = new EventEmitter();
    @Output() formUpdate = new EventEmitter();

    constructor(
        public menuService:MenuService,
        public override httpclient:HttpClient,
        public commonBroadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        private router:Router,
        messageService: MessageService,
        private confirmationService: ConfirmationService){
            super(menuService,httpclient,commonBroadcastService,messageService)
    }

    ngOnInit(): void {
        
        if(this.menuImageId != undefined)
        {
            if(this.menuImageId != '0'){
                this.getImageMenuById();
                this.header = "Edit Image Menu Details";
            }else{
                this.header ="Add Image Menu Details";
                this.menuDetailForm.patchValue({
                    id: '0'
                });
            }
            
        }
    }

    getImageMenuById = () => {
        this.baseUrl = environment.inventory.imageMenu;
        this.action = this.menuImageId;
        this.GetItem(new HttpParams()).subscribe({
            next: result => {
                if(result!=null){
                    this.menuDetailForm.setValue({
                        id: result.id,
                        itemName: result.itemName,
                        data: result.data,
                        active: result.active,
                        description: result.description
                    });
                }
            },
            error: error => {
                console.log(error);
            }
        });
    }

    goBack = () => {
        this.router.navigate(['admin/image-menu-list']);
    }

    myUploader = (event:any) => {
        console.log(event);
    }

    submitForm = (forms:FormGroup) => {
        if(forms.valid){
            this.formUpdate.emit(forms.value);
            this.activeItem.emit(2);
        }
    }
    
}