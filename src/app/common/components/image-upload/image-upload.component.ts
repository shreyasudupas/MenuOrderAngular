import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'image-upload',
    templateUrl: './image-upload.component.html',
    styleUrls: [ './image-upload.component.scss' ]
})

export class ImageUploadComponent implements OnInit {
uploadFile:any;
fileType:any;
url:any;
uploadBufferFile:any;

@Input()    
imagePath:string;

@Output()
uploadImageData = new EventEmitter<any>();

@Output()
deleteImageData = new EventEmitter<any>();

    constructor() {}

    ngOnInit(): void {
        
    }

    myUploader(event:any,files:any) {
        this.imagePath = undefined; //to reverese already set image
        this.uploadFile = event.files;
        this.fileType = this.uploadFile[0].type;
        const allowed_types = ['image/png', 'image/jpeg'];

        if(!allowed_types.includes(this.fileType)){
            alert('Image must be of type jpg| png')
        }

        if(this.uploadFile[0].size >= 100000){
            alert('Image Should be less than 1MB')
            this.uploadFile = undefined;
        }else{

            const reader = new FileReader();
        
            reader.readAsDataURL(this.uploadFile[0]); 
            reader.onload = (_event) => { 
                this.url = reader.result; 
            }
        }

        files.clear(); //clear the file upload so upload button will reset
    }

    updateImageModel = (imageUrl:string,fileType:any) => {
        let imageType = '';
        if(fileType.split('/')[1] === "jpeg"){
            imageType = "jpg";
        }else{
            imageType ="png";
        }

        let urlSplit = 'data:' + fileType + ';base64,';
        let imageData = imageUrl.split(urlSplit)[1];

        return {
            imageType,imageData,uploadFile:this.uploadFile[0]
        }
    }

    submitImage() {
        if(this.uploadFile !== undefined) {
            let imageData = this.updateImageModel(this.url,this.fileType);

            //send the image url and its type to parent component
            this.uploadImageData.emit(imageData);

            this.uploadBufferFile = this.uploadFile;
            this.uploadFile = undefined; //reset upload file variable

        } else {
            alert('Image not selected to upload');
        }
    }

    deleteImage() {
        if(this.uploadFile !== undefined) {
            this.uploadFile == undefined;
            this.deleteImageData.emit(true);
        } else if (this.url !== undefined) {
            //after upload
            this.uploadBufferFile = undefined;
            this.url = undefined;
            this.deleteImageData.emit(true);
        }
        else if(this.imagePath !== undefined) {
            this.deleteImageData.emit(true);
        }
    }
}