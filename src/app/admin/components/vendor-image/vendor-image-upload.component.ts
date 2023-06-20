import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BaseComponent } from 'src/app/common/components/base/base.component';
import { CommonDataSharingService } from 'src/app/common/services/common-datasharing.service';
import { MenuService } from 'src/app/common/services/menu.service';
import { NavigationService } from 'src/app/common/services/navigation.service';
import { environment } from 'src/environments/environment';
import { Vendor } from '../vendor/vendor';

@Component({
    selector: 'vendor-image-upload',
    templateUrl: './vendor-upload.component.html'
})

export class VendorImageUploadComponent extends BaseComponent<any> implements OnInit{
@Input() vendorInfo:Vendor;
@Input() vendorImage:string;
@Output() sendVendorImageFileToVendorDetail = new EventEmitter();
uploadFile:any;
url:any;
fileType:any;
imageData:string='';
imageType:string='';
isAdd:boolean;

    constructor(
        public menuService:MenuService,
        public override httpclient:HttpClient,
        public commonBroadcastService:CommonDataSharingService,
        private router:Router,
        messageService: MessageService,
        public navigation:NavigationService
        ){
            super(menuService,httpclient,commonBroadcastService,messageService)
        }
    
    ngOnInit(): void {
        if(this.vendorImage !== undefined){
            this.isAdd = false;
        }else{
            this.isAdd = true;
        }
    }

    myUploader = (event:any,form:any) => {
        //console.log(event);
        this.vendorImage = undefined; //to reverese already set image
        this.uploadFile = event.files;
        this.fileType = this.uploadFile[0].type;
        const allowed_types = ['image/png', 'image/jpeg'];

        if(!allowed_types.includes(this.fileType)){
            this.showError('Image must be of type jpg| png')
        }

        if(this.uploadFile[0].size >= 100000){
            this.showError('Image Should be less than 1MB')
            this.uploadFile = undefined;
        }else{

            const reader = new FileReader();
        
            reader.readAsDataURL(this.uploadFile[0]); 
            reader.onload = (_event) => { 
                this.url = reader.result; 
                
            }
        }

        form.clear();
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

    submitVendorImage() {
        if(this.uploadFile !== undefined && (this.vendorInfo != null && this.vendorInfo !== undefined)){
            //console.log('File Uploaded');
            this.updateImageModel(this.url,this.fileType);

            if(this.isAdd === true){
                var body = {
                    id: null,
                    itemName: this.vendorInfo.vendorName,
                    description: 'vendor image for vendor id: ' + this.vendorInfo.id + 'with Vendor name: ' + this.vendorInfo.vendorName,
                    active: true,
                    image: {
                        data: this.imageData,
                        type:this.imageType
                    }
                };
    
                this.addMenuImage(body);
            }else{
                //update
                var updateBody = {
                    id: '',
                    itemName: this.vendorInfo.vendorName,
                    description: 'vendor image for vendor id: ' + this.vendorInfo.id + 'with Vendor name: ' + this.vendorInfo.vendorName,
                    active: true,
                    image: {
                        data: this.imageData,
                        type:this.imageType
                    }
                };

                this.updateMenuImage(updateBody);
            }
            

            
        }else{
            this.showError('File is not Uploaded/ VendorId is not empty');
        }
    }

    addMenuImage = (body:any) => {
        this.baseUrl = environment.inventory.imageMenu;
        this.action= 'upload';
        this.Create(body).subscribe({
            next: result => {
                if(result != null){
                    this.showInfo('Submitted Successfully');

                    // setTimeout(()=>{
                    //     this.router.navigateByUrl('/admin/image-menu-list');
                    // },1500);
                    this.vendorInfo.image.imageId = result.id;
                    this.vendorInfo.image.imageFileName = result.fileName;
                    this.updateVendor(this.vendorInfo);

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

    updateVendor(vendor:Vendor){
        this.baseUrl = environment.inventory.vendor;
        this.action= null;

        let openTime = formatDate(vendor.openTime,'h:mm:ss','en-US');
        let closeTime = formatDate(vendor.closeTime,'h:mm:ss','en-US');

        vendor = {...vendor, openTime: openTime,closeTime: closeTime };

        if(vendor.categories.length > 0){
            vendor.categories.map(c => {
                c.openTime = formatDate(c.openTime,'h:mm:ss','en-US')
                c.closeTime = formatDate(c.closeTime,'h:mm:ss','en-US')
            })
        }

        let body = {
            VendorDetail: vendor
        };

        this.UpdateItem(body).subscribe({
            next: result => {
                //debugger;
                if (result !== null) {
                    this.showInfo('Vendor Updated Successfully');

                    setInterval(() => {
                        window.location.reload();
                    },1500);
                } else {
                    this.showError('Error in Updating the Vendor');
                }
            },
            error: error => {
                console.log(error);

                this.showError('Error in Updating VendorDetail');
            }
        });
    }

    updateMenuImage = (body:any) => {
        this.baseUrl = environment.inventory.imageMenu;
        this.action= 'upload';
        this.UpdateItem(body).subscribe({
            next: result => {
                if(result != null){
                    this.showInfo('Updated Image Successfully');

                    this.vendorInfo.image.imageId = result.id;
                    this.vendorInfo.image.imageFileName = result.fileName;
                    this.updateVendor(this.vendorInfo);
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

    deleteVedorImage(){
        if(this.vendorInfo !== undefined){
            let id = this.vendorInfo.image.imageId;

            this.deleteImage(id);
        }
    }

    deleteImage(id:string){
        this.baseUrl = environment.inventory.imageMenu;
        this.action= id;

        this.DeleteItem(null).subscribe({
            next: result => {
                if(result != null){
                    this.vendorImage = undefined;
                    this.showInfo('Image successfully deleted');

                    this.vendorInfo = {...this.vendorInfo, image: { imageId:'',imageFileName:'' }};
                    this.updateVendor(this.vendorInfo);
                }else{
                    this.showError('Error in deleting file');
                }
            },
            error: err => console.log('Error in deleting file')
        });
    }
}