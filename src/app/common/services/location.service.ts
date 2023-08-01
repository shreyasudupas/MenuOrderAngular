import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { BehaviorSubject, lastValueFrom ,Observable } from 'rxjs'
import { environment } from 'src/environments/environment';
import { SearchLocationResponse } from '../models/nomitmSearchLocationResponse';
import { UserLocation } from '../models/userLocationModel'

@Injectable()

export class LocationService{
private userLocation = new UserLocation();
private userLocationSubcription = new BehaviorSubject<UserLocation>(undefined);

constructor(private httpClient:HttpClient) {}

    public getUserLocation(): UserLocation {
        return this.userLocation;
    }

    public updateUserLocation(updatedUserLocation:UserLocation ) {
        this.userLocation = {...this.userLocation, latitude: updatedUserLocation.latitude, area: updatedUserLocation.area,
        city: updatedUserLocation.city, longitude: updatedUserLocation.longitude };

        this.userLocationSubcription.next(this.userLocation);
    }

    public getUserLocationUpdate() : Observable<UserLocation> {
        return this.userLocationSubcription.asObservable();
    }

    public async searchUserLocationByAreaCityName(query:string) {
        let url = environment.location.forwardGeoCoding;
        url = url.replace('{query}',query);

        let locationResult$ = this.httpClient.get<SearchLocationResponse[]>(url);

        let locationResult = await lastValueFrom(locationResult$).catch(err=>{
            console.log('Error Occured in Search Geocoding Location',err);
            return null;
        });

        return locationResult;
    }

    public async searchUserLocationByCoordinates(latitude:string,longitude:string) {
        let url = environment.location.reverseGeoCoding;
        url = url.replace('{latitude}',latitude);
        url = url.replace('{longitude}',longitude);

        let locationResult$ = this.httpClient.get<SearchLocationResponse>(url);

        let locationResult = await lastValueFrom(locationResult$).catch(err=>{
            console.log('Error Occured in Search Reverse Geocoding Location',err);
            return null;
        });

        return locationResult;
    }
}