import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'location-search-dropdown',
    templateUrl: './location-search-dropdown.component.html',
    styleUrls: [ './location-search-dropdown.component.scss' ]
})

export class LocationSearchDropdown implements OnInit {
    searchLocation: string = '';
    searchDropDownList:string[];
    isLocationListOpened:boolean = false;
    displayLocationName:string = '';

    constructor() {}

    ngOnInit(): void {
        
    }

    getLocationFromUserBrowser() {
        if (!navigator.geolocation) {
            throw new Error('No support for geolocation');
        }
      
        navigator.geolocation.getCurrentPosition((position) => {
            const longitude = position.coords.longitude;
            const latitude = position.coords.latitude;
            console.log([latitude.toString(), longitude.toString()]);
        });
    }

    fetchLocation(event: any) {
        this.searchDropDownList = ["Katreguppe,Bangalore","BSK 3rd Stage, Bangalore","BSK 2nd Stage, Bangalore","Banashankari blah blah bagh 2nd Stage, Bangalore"];
        this.isLocationListOpened = true;

        if (event.target.value === '') {
            this.searchDropDownList = [];
            this.isLocationListOpened = !this.isLocationListOpened;
        }else{
            this.searchDropDownList = this.searchDropDownList.filter((area) => {
                return area.toLowerCase().startsWith(event.target.value.toLowerCase());
            });

            if(this.searchDropDownList.length == 0){
                this.searchDropDownList = [" No Location Found "]
            }
        }
    }

    clickedOutside(event:Event): void {
        this.isLocationListOpened = false;
    }

    locationSelection(locationName:string) : void {
        this.displayLocationName = locationName;
        this.searchLocation = "";
        //console.log(this.locationName);
        this.isLocationListOpened = false;
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