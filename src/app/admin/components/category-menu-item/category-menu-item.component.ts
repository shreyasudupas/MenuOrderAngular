import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { CategoryMenuItem } from '../categories/category-menu-item';
import { FoodType } from '../food-type-details/food-type';
import { ImageData } from 'src/app/admin/components/menu-image-details/image-response';

@Component({
    selector: 'category-menu-item',
    templateUrl: './category-menu-item.component.html',
    styleUrls: ['./category-menu-item.component.scss']
})

export class CategoryMenuItemComponent implements OnInit {
    @Input() menuItem:CategoryMenuItem;
    @Input() categoryName:string;
    menuitemForm:FormGroup;
    showPreviewImage:boolean;
    foodTypeDropDownList:FoodType[]=[];
    imageUploadDialog:boolean= false;
    imageUrl:string = "";
    currentImageId:string = "";
    sendMenuItemNameToImageSelection:string;

    constructor(private fb:FormBuilder,private http:HttpClient) {}

    ngOnInit() {

        this.menuitemForm = this.fb.group({
            id:[''],
            itemName: ['',Validators.required],
            imageId:[''],
            imageFilename:[''],
            foodType: ['',Validators.required],
            price: [0,Validators.required],
            discount:[0],
            active:[true]
        });

        if(this.menuItem !== undefined) {
            this.setForm(this.menuItem);
        }

        this.getFoodTypeDropDownList();
    }

    setForm(menuItem:CategoryMenuItem) {
        this.menuitemForm.setValue({
            id: menuItem.id,
            itemName: menuItem.itemName,
            imageId: menuItem.imageId,
            imageFilename: menuItem.imageFilename,
            foodType: menuItem.foodType,
            price: menuItem.price,
            discount: menuItem.discount,
            active: menuItem.active
        });
    }

    getFoodTypeDropDownList() {
        let url = environment.inventory.foodtype + '/list?isActive=true';

        this.http.get(url).subscribe({
            next: (result:any) => {
                this.foodTypeDropDownList = result;
            }
        });
    }

    submitCategoryMenuItem() {
        if(this.menuitemForm.valid) {
            console.log(this.menuitemForm.value);
        }
    }

    getImageSelection = ($event:ImageData) => {
        //console.log('Item gor From Parent' + JSON.stringify($event));
        if($event !== null){

            this.menuitemForm.patchValue({
                imageId: $event.id,
                imageFilename: $event.fileName
            });

            //update preview image
            this.imageUrl = 'data:image/png;base64, ' + $event.data;
            this.showPreviewImage = true;
        }else{
            
            this.menuitemForm.patchValue({
                imageId: '',
                imageFilename: ''
            });

            this.showPreviewImage = false;
        }
    }
    
    callImageUploaderDialog = () => {
        this.imageUploadDialog = true;
        this.sendMenuItemNameToImageSelection = this.menuitemForm.controls['itemName'].value;
    }

    closeImageDialog = ($event:boolean) => {
        this.imageUploadDialog = $event;
    }
}