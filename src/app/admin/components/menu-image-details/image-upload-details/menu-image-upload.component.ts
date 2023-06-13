import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { BaseComponent } from "src/app/common/components/base/base.component";
import { CommonDataSharingService } from "src/app/common/services/common-datasharing.service";
import { MenuService } from "src/app/common/services/menu.service";
import { environment } from "src/environments/environment";

@Component({
    selector: 'menu-image-upload-detail',
    templateUrl: 'menu-image-upload.component.html',
    providers: [ ConfirmationService ]
})

export class MenuImageUploadComponent extends BaseComponent<any> implements OnInit{
@Output() activeDetailPage = new EventEmitter();
@Input() menuDetailForm!:FormGroup;
uploadFile:any;
url:any;
fileType:any;
imageData:string='';
imageType:string='';

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
        console.log(this.menuDetailForm);
    }

    formControlValue(name:string){
        return this.menuDetailForm.controls[name].value
    }

    myUploader = (event:any,form:any) => {
        //console.log(event);
        this.uploadFile = event.files;
        this.fileType = this.uploadFile[0].type;
        const allowed_types = ['image/png', 'image/jpeg'];

        if(!allowed_types.includes(this.fileType)){
            this.showError('Image must be of type jpg| png')
        }

        const reader = new FileReader();
        
        reader.readAsDataURL(this.uploadFile[0]); 
        reader.onload = (_event) => { 
            this.url = reader.result; 

            this.menuDetailForm.patchValue({
               data: '' 
            });
        }

        form.clear();
    }

    goToPreviousStep = () => {
        this.activeDetailPage.emit(1);
    }

    submit = () => {
        var menuId = this.formControlValue('id');

        if(this.uploadFile != undefined && menuId !== "0"){
            //edit opertation
            this.updateImageModel(this.url,this.fileType);

            var body = {
                id: this.formControlValue('id'),
                itemName: this.formControlValue('itemName'),
                description: this.formControlValue('description'),
                active: this.formControlValue('active'),
                image: {
                    data: this.imageData,
                    type:this.imageType
                }
            };

            this.updateMenuImage(body);
        }
        else if(this.uploadFile === undefined && menuId !== "0"){ //edit opertion without image update
            //update without Image
            var bodyWithoutImage = {
                id: this.formControlValue('id'),
                itemName: this.formControlValue('itemName'),
                description: this.formControlValue('description'),
                active: this.formControlValue('active'),
                image :{
                    data: '',
                    type: ''
                }
            };
            this.updateMenuImage(bodyWithoutImage);
        }
        else if(this.uploadFile === undefined && menuId === "0"){
            this.showError('Please Upload the file');
        }else if(this.uploadFile !== undefined && menuId === "0") {
            this.updateImageModel(this.url,this.fileType);

            var addBody = {
                id: "",
                itemName: this.formControlValue('itemName'),
                description: this.formControlValue('description'),
                active: this.formControlValue('active'),
                image: {
                    data: this.imageData,
                    type:this.imageType
                }
            };

            this.addMenuImage(addBody);
        }
    }

    updateMenuImage = (body:any) => {
        this.baseUrl = environment.inventory.imageMenu;
        this.action= 'upload';
        this.UpdateItem(body).subscribe({
            next: result => {
                if(result != null){
                    this.showInfo('Submitted Successfully');

                    setTimeout(()=>{
                        this.router.navigateByUrl('/admin/image-menu-list');
                    },1500);

                }else{
                    this.showError('Error in updating menu image');
                }
                console.log(result);
            },
            error: err => {
                console.log(err);
            }
        });
    }

    addMenuImage = (body:any) => {
        this.baseUrl = environment.inventory.imageMenu;
        this.action= 'upload';
        this.Create(body).subscribe({
            next: result => {
                if(result != null){
                    this.showInfo('Submitted Successfully');

                    setTimeout(()=>{
                        this.router.navigateByUrl('/admin/image-menu-list');
                    },1500);

                }else{
                    this.showError('Error in adding menu image');
                }
                console.log(result);
            },
            error: err => {
                console.log(err);
            }
        });
    }

    updateImageModel = (imageUrl:string,fileType:any) => {
        if(fileType.split('/')[1] === "jpeg"){
            this.imageType = "jpg";
        }else{
            this.imageType ="png";
        }

        let urlSplit = 'data:' + fileType + ';base64,';
        this.imageData = imageUrl.split(urlSplit)[1]
    }
}