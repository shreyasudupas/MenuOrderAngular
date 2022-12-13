import { state } from "@angular/animations";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponent } from "src/app/common/components/base/base.component";
import { RequestResource, ResourceServiceForkRequest } from "src/app/common/models/resourceServiceForkRequest";
import { State } from "src/app/common/models/state";
import { CommonDataSharingService } from "src/app/common/services/common-datasharing.service";
import { MenuService } from "src/app/common/services/menu.service";
import { environment } from "src/environments/environment";
import { RegisteredLocationReponse } from "./registerLocation";

@Component({
    selector: 'vendor-detail',
    templateUrl: './vendor-detail.component.html'
})
export class VendorDetailComponent extends BaseComponent<any> implements OnInit{
vendorId!:string;
categories:any[] = [];
selectedCategory!:string;
vendorDetailForm!: FormGroup;
//options:any;
forkRequest: ResourceServiceForkRequest = new ResourceServiceForkRequest();
locations:RegisteredLocationReponse[]=[];
stateDropDownValues:any[]=[];
cityDropDownListValues:any[]=[];
areaDropDownListValues:any[]=[];
currentState:State={ id:0,name:'',cities:[] };

    constructor(
        public menuService:MenuService,
        public override httpclient:HttpClient,
        public commonBroadcastService:CommonDataSharingService,
        private activatedRoute:ActivatedRoute,
        private router:Router,
        private fb: FormBuilder){
            super(menuService,httpclient,commonBroadcastService)

            this.categories = [
                { label: 'Vegetarian',value: 'Veg'},
                { label: 'NonVegetarian', value: 'NonVeg' },
                { label: 'Veg/NonVegetarian', value: 'Both' },
            ]
    }

    ngOnInit(): void {
        //debugger
        this.componentName = this.activatedRoute.snapshot.routeConfig?.component?.name;

        this.InitilizeMenu();

        let vendoreIdState = history.state.vendorId;

        if(vendoreIdState !== undefined){
            this.vendorId = vendoreIdState;
        }else{
                //alert('undefined')
        }

        this.vendorDetailForm = this.fb.group({
            vendorId: [''],
            vendorName: ['',Validators.required],
            vendorDescription: ['',Validators.required],
            category: ['',Validators.required],
            type: ['',Validators.required],
            state: ['',Validators.required],
            city: ['',Validators.required],
            area: ['',Validators.required],
            addressLine1: ['',Validators.required],
            addressLine2: [''],
            openTime: [new Date()],
            closeTime: [new Date()],
            active: [false]
        });

        //this.setFormDefaultValue();
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

        this.getForkItems(this.forkRequest).subscribe(([locationResponse])=>{
            //console.log(locationResponse);
            this.locations = locationResponse;

            //add states to dropdown
            this.locations.forEach(location=>{
                this.stateDropDownValues.push({label:location.state.name,value:location.state.name});
            });

            //reset area and city
            this.cityDropDownListValues=[];
            this.areaDropDownListValues=[];
            
        });
    }

    formControlValidation(name:string){
        return (this.vendorDetailForm.get(name)?.invalid && (this.vendorDetailForm.get(name)?.dirty || this.vendorDetailForm.get(name)?.touched))
    }

    goBackToVendor(){
        this.router.navigateByUrl('/admin/vendor');
    }

    setFormDefaultValue = () => {
        this.vendorDetailForm.setValue({
            vendorId: '',
            vendorName: '',
            vendorDescription: '',
            category: '',
            type: '',
            state: '',
            city: '',
            area: '',
            addressLine1: '',
            addressLine2: '',
            openTime: new Date(),
            closeTime: new Date(),
            active: false
        })
    }

    onSubmitVendorDetails = (forms:FormGroup) => {
        if(forms.valid){
            alert('Form is valid');
        }
    }

    getCities = (event:any) => {
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
}