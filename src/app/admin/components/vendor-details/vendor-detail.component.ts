import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { BaseComponent } from "src/app/common/components/base/base.component";
import { RequestResource, ResourceServiceForkRequest } from "src/app/common/models/resourceServiceForkRequest";
import { State } from "src/app/common/models/state";
import { CommonDataSharingService } from "src/app/common/services/common-datasharing.service";
import { MenuService } from "src/app/common/services/menu.service";
import { environment } from "src/environments/environment";
import { CuisineType } from "../cuisine-type-details/cuisine-type";
import { Vendor } from "../vendor/vendor";
import { RegisteredLocationReponse } from "./registerLocation";

@Component({
    selector: 'vendor-detail',
    templateUrl: './vendor-detail.component.html',
    styleUrls:['./vendor-detail.component.scss'],
    providers: [MessageService]
})

export class VendorDetailComponent extends BaseComponent<Vendor> implements OnInit{
vendorId!:string;
selectedCategory!:string;
vendorDetailForm!: FormGroup;
header:string='';
//options:any;
forkRequest: ResourceServiceForkRequest = new ResourceServiceForkRequest();
locations:RegisteredLocationReponse[]=[];
stateDropDownValues:any[]=[];
cityDropDownListValues:any[]=[];
areaDropDownListValues:any[]=[];
cuisineDropDownList:CuisineType[]=[];
currentState:State={ id:0,name:'',cities:[] };
vendorDetail:Vendor = { id:'',active:false,addressLine1:'',addressLine2:'',vendorName:'',vendorDescription:'',area:'',city:'',categories:[],
    closeTime: new Date(),openTime: new Date(),coordinates:{ latitude:0.0,longitude:0.0 },rating:0,cuisineType:[],state :'' };

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
        //debugger
        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;

        this.InitilizeMenu();

        this.vendorId = this.activatedRoute.snapshot.params['vendorId'];

        if(this.vendorId === '0'){
            this.header = 'Add Vendor Details'
        }else{
            this.header = 'Edit Vendor Details'
        }

        this.vendorDetailForm = this.fb.group({
            id: [''],
            vendorName: ['',Validators.required],
            vendorDescription: ['',Validators.required],
            cuisineType: [ [] ],
            state: ['',Validators.required],
            city: ['',Validators.required],
            area: ['',Validators.required],
            addressLine1: ['',Validators.required],
            addressLine2: [''],
            openTime: [new Date()],
            closeTime: [new Date()],
            active: [false]
        });

        // this.options = {
        //     center: {lat: 36.890257, lng: 30.707417},
        //     zoom: 12
        // };

        //call fork items
        let request1:RequestResource = {
            httpMethod:'get',
            requestUrl: environment.auth.idpAuthority + '/api/utility/getAllLocations',
            body:null
        };
        this.forkRequest.requestParamter.push(request1);

        let request2:RequestResource = {
            httpMethod:'get',
            requestUrl: environment.inventory.vendor + '/'  + this.vendorId,
            body: null
        }
        this.forkRequest.requestParamter.push(request2);

        let request3:RequestResource = {
            httpMethod:'get',
            requestUrl: environment.inventory.cuisineType + '/list?isActive=true' ,
            body: null
        }
        this.forkRequest.requestParamter.push(request3);

        this.getForkItems(this.forkRequest).subscribe(([locationResponse,vendorByIdResponse,cuisineList])=>{
            //debugger;
            let error = 'Error occurred';
            //console.log(locationResponse);
            if(locationResponse != error){
                this.locations = locationResponse;

                //add states to dropdown
                this.locations.forEach(location=>{
                    this.stateDropDownValues.push({label:location.state.name,value:location.state.name});
                });
    
                //reset area and city
                this.cityDropDownListValues=[];
                this.areaDropDownListValues=[];
            }else{
                this.showError('Unable to Get Location details right now');
            }

            //console.log(vendorByIdResponse);
            if(vendorByIdResponse != error){
                this.vendorDetail = {...this.vendorDetail, categories: vendorByIdResponse.categories, id: vendorByIdResponse.id , vendorName: vendorByIdResponse.vendorName,
                    active: vendorByIdResponse.active,addressLine1: vendorByIdResponse.addressLine1, addressLine2: vendorByIdResponse.addressLine2,area: vendorByIdResponse.area,
                    state: vendorByIdResponse.state, city: vendorByIdResponse.city, closeTime: new Date(vendorByIdResponse.closeTime),coordinates: vendorByIdResponse.coordinates,
                    openTime: new Date(vendorByIdResponse.openTime), rating: vendorByIdResponse.rating, cuisineType: vendorByIdResponse.cuisineType
                    , vendorDescription: vendorByIdResponse.vendorDescription }

                this.vendorDetailForm.setValue({
                    id: this.vendorDetail.id,
                    vendorName: this.vendorDetail.vendorName,
                    vendorDescription: this.vendorDetail.vendorDescription,
                    cuisineType: this.vendorDetail.cuisineType,
                    state: this.vendorDetail.state,
                    city: this.vendorDetail.city,
                    area: this.vendorDetail.area,
                    addressLine1: this.vendorDetail.addressLine1,
                    addressLine2: this.vendorDetail.addressLine2,
                    openTime: this.vendorDetail.openTime,
                    closeTime: this.vendorDetail.closeTime,
                    active: this.vendorDetail.active
                });

                //get cities and states dropdown update
                let state = this.stateDropDownValues.find(s=>s.label == this.vendorDetail.state);
                this.getCities({ value: state.value});

                let city = this.cityDropDownListValues.find(c=>c.label == this.vendorDetail.city);
                this.getAreas({ value: city.value});
            }else{
                this.showError('Unable to Get vendor details right now');
            }

            if(cuisineList !== error){
                //console.log(cuisineList);
                this.cuisineDropDownList = cuisineList;

                // this.vendorDetailForm.patchValue({
                //     cuisineList
                // })
            }else{
                this.showError('Unable to Get cuisine details right now');
            }
        });
    }

    formControlValidation(name:string){
        return (this.vendorDetailForm.get(name)?.invalid && (this.vendorDetailForm.get(name)?.dirty || this.vendorDetailForm.get(name)?.touched))
    }

    goBackToVendor(){
        this.router.navigateByUrl('/admin/vendor');
    }

    onSubmitVendorDetails = (forms: FormGroup) => {
        if (forms.valid) {
            //alert('Form is valid' + forms.value);

            if (this.vendorId === '0') {
                this.baseUrl = environment.inventory.vendor;
                this.action = null;

                let body = {
                    VendorDetail: forms.value
                };

                this.Create(body).subscribe({
                    next: result => {
                        //debugger;
                        if (result !== null) {

                            this.vendorDetail = {
                                ...this.vendorDetail, categories: result.categories, id: result.id, vendorName: result.vendorName,
                                active: result.active, addressLine1: result.addressLine1, addressLine2: result.addressLine2, area: result.area,
                                state: result.state, city: result.city, closeTime: new Date(result.closeTime), coordinates: result.coordinates,
                                openTime: new Date(result.openTime), rating: result.rating, cuisineType: result.cuisineType
                                , vendorDescription: result.vendorDescription
                            }

                            this.vendorId = this.vendorDetail.id;

                            window.history.replaceState({}, '', `admin/vendor-detail/${this.vendorId}`);

                            this.showInfo('Vendor successfully added');

                            //this.router.navigateByUrl('admin/vendor-detail/' + this.vendorId);
                        }
                    },
                    error: error => {
                        console.log(error);
                        this.showError('Error in adding the Vendor');
                    },
                    complete: () => {
                        console.log('Request complete');
                    }
                });
            } else {
                this.baseUrl = environment.inventory.vendor;
                this.action = null;

                let body = {
                    VendorDetail: forms.value
                };

                this.UpdateItem(body).subscribe({
                    next: result => {
                        //debugger;
                        if (result !== null) {
                            this.showInfo('Vendor Updated Successfully');
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
        }
    }

    getCities = (event:any) => {
        //debugger
        let stateName = event.value;
        let getState = this.locations.find(item=> item.state.name == stateName);
        this.cityDropDownListValues=[];
        
        if(getState !== undefined){
            this.currentState = {...this.currentState, id:getState?.state.id,name:getState.state.name,cities:getState.state.cities};
            let getCities = this.currentState.cities;

            getCities.forEach(city=>{
                this.cityDropDownListValues.push({label:city.name,value:city.name});
            });
            
            this.areaDropDownListValues = [];
        }
    }

    getAreas= (event:any) => {
        let cityName = event.value;
        
        if(this.currentState.id> 0){
            let findCity = this.currentState.cities.find(c=>c.name == cityName);

            if(findCity !== undefined){
                let areas = findCity.areas;

                areas.forEach(a=> this.areaDropDownListValues.push({label:a.areaName,value:a.areaName}));
            }
        }
    }

    goToCategory = (id:string) => {
        this.router.navigateByUrl('/admin/category/' + id,
        {
            state: { vendorId: this.vendorId }
        });
    }

    goToEditCategoryPage = (id:string) => {
        this.router.navigateByUrl('/admin/category/' + id,
        {
            state: { vendorId: this.vendorId  }
        });
    }

    goToMenuPage = () => {
        
    }
}