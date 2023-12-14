import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SearchLocationResponse } from '../../models/nomitmSearchLocationResponse';
import { UserLocation } from '../../models/userLocationModel';
import { LocationService } from '../../services/location.service';

@Component({
    selector: 'location-search-dropdown',
    templateUrl: './location-search-dropdown.component.html',
    styleUrls: [ './location-search-dropdown.component.scss' ]
})

export class LocationSearchDropdown implements OnInit {
    searchLocation: string = '';
    searchDropDownList:SearchLocationResponse[];
    isLocationListOpened:boolean = false;
    displayLocationName:string = '';

    constructor(private locationService:LocationService,
        private httpClient:HttpClient) {}

    ngOnInit(): void {
        this.locationService.getLocationFromUserBrowser();

        //get location update
        this.locationService.getUserLocationUpdate().subscribe({
            next: result => {
                if(result !== undefined){
                    this.displayLocationName = result.displayName;
                }
            }
        })
    }


    async fetchLocation(event: any) {
        
        let searchvalue = event.target.value;
        this.isLocationListOpened = true;
        this.searchDropDownList = [];

        if (event.target.value === '') {
            this.isLocationListOpened = !this.isLocationListOpened;
        } else {

            let result = await this.locationService.searchUserLocationByAreaCityName(searchvalue);

            if(result === null){
                this.searchDropDownList = [];
            } else {
                
                this.searchDropDownList = result;

                //console.log(this.searchDropDownList);
            }
        }
    }

    clickedOutside(event:Event): void {
        this.isLocationListOpened = false;
    }

    locationSelection(location:SearchLocationResponse) : void {
        let locationSplit = location.displayName.split(',');
        this.displayLocationName = locationSplit[0] + ' ,' + locationSplit[1] + ' ,' + locationSplit[2];

        this.searchLocation = "";
        //console.log(this.locationName);
        this.isLocationListOpened = false;

        let userLocation:UserLocation =  {
            latitude: location.latitude,
            longitude: location.longitude,
            address: location.displayName,
            city: (location.address === undefined)?'':location.address.city,
            area: (location.address === undefined)?'':location.address.suburb,
            displayName: (location.address === undefined)?this.displayLocationName:location.address.road + ' ,' + location.address.suburb
        };

        this.locationService.updateUserLocation(userLocation);
    }

    openSearchBox() {
        this.searchLocation = this.displayLocationName;
        this.displayLocationName = '';
    }

    cancelSearch() {
        
        this.searchLocation = '';

        this.isLocationListOpened = false;
    }
}