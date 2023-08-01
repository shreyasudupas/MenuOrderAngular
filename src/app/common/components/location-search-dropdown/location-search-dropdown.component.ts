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

    constructor(private locationService:LocationService) {}

    ngOnInit(): void {
        this.getLocationFromUserBrowser();
    }

    getLocationFromUserBrowser() {
        if (!navigator.geolocation) {
            throw new Error('No support for geolocation');
        }
      
        navigator.geolocation.getCurrentPosition(async (position) => {
            const longitude = position.coords.longitude.toString();
            const latitude = position.coords.latitude.toString();
            //console.log([latitude.toString(), longitude.toString()]);
            
            let userLocationResult = await this.locationService.searchUserLocationByCoordinates(latitude,longitude);
            if(userLocationResult !== null) {
                this.displayLocationName = userLocationResult.address.road + ' ,' + userLocationResult.address.suburb;

                let userLocation:UserLocation =  {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    address: userLocationResult.display_name,
                    city: userLocationResult.address.city,
                    area: userLocationResult.address.suburb
                };

                this.locationService.updateUserLocation(userLocation);
            }

        });
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
        let locationSplit = location.display_name.split(',');
        this.displayLocationName = locationSplit[0] + ' ,' + locationSplit[1] + ' ,' + locationSplit[2];

        this.searchLocation = "";
        //console.log(this.locationName);
        this.isLocationListOpened = false;

        let userLocation:UserLocation =  {
            latitude: location.lat,
            longitude: location.lon,
            address: location.display_name,
            city: '',
            area: ''
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