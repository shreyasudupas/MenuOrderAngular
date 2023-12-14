import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { lastValueFrom ,Observable, BehaviorSubject, switchMap } from 'rxjs'
import { environment } from 'src/environments/environment';
import { SearchLocationResponse } from '../models/nomitmSearchLocationResponse';
import { UserLocation } from '../models/userLocationModel'

@Injectable()

export class LocationService{
private userLocation = new UserLocation();
private userLocationSubcription = new BehaviorSubject<UserLocation>(undefined);
locationInProgress:boolean = true;

constructor(private httpClient:HttpClient) {}

    public getUserLocation(): UserLocation {
        return this.userLocation;
    }

    public updateUserLocation(updatedUserLocation:UserLocation ) {
        this.userLocation = {...this.userLocation, latitude: updatedUserLocation.latitude, area: updatedUserLocation.area,
        city: updatedUserLocation.city, longitude: updatedUserLocation.longitude, displayName: updatedUserLocation.displayName };

        this.userLocationSubcription.next(this.userLocation);
    }

    public getUserLocationUpdate() : Observable<UserLocation> {
        return this.userLocationSubcription.asObservable();
    }

    public async searchUserLocationByAreaCityName(query:string) : Promise<SearchLocationResponse[]|null> {
        let url = environment.idsConfig.location.forward;
        url = url.replace('{query}',query);

        let locationResult$ = this.httpClient.get<SearchLocationResponse[]>(url);

        let locationResult = await lastValueFrom(locationResult$).catch(err=>{
            console.log('Error Occured in Search Geocoding Location',err);
            return null;
        });

        return locationResult;
    }

    public async searchUserLocationByCoordinates(latitude:string,longitude:string): Promise<SearchLocationResponse | null> {

        let url = environment.idsConfig.location.reverse;
            url = url.replace('{latitude}',latitude);
            url = url.replace('{longitude}',longitude);
        let locationResult:any;
    
        let locationResult$ = this.httpClient.get<SearchLocationResponse>(url);

        locationResult = await lastValueFrom(locationResult$).catch(err=>{
            console.log('Error Occured in Search Reverse Geocoding Location',err);
            return null;
        });

        return locationResult;
    }

    getLocationFromUserBrowser() {
        if (!navigator.geolocation) {
            throw new Error('No support for geolocation');
        }
      
        navigator.geolocation.getCurrentPosition(async (position) => {

            if(this.locationInProgress) {
                this.locationInProgress = false; //API should not be called twice hence this flag
                const longitude = position.coords.longitude.toString();
                const latitude = position.coords.latitude.toString();
                //console.log([latitude.toString(), longitude.toString()]);
                
                let userLocationResult = await this.searchUserLocationByCoordinates(latitude,longitude);
                
                if(userLocationResult !== null && userLocationResult !== undefined) {
    
                    let userLocation:UserLocation =  {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        address: userLocationResult.displayName,
                        city: userLocationResult.address.city,
                        area: userLocationResult.address.suburb,
                        displayName: userLocationResult.address.road + ' ,' + userLocationResult.address.suburb
                    };
    
                    this.updateUserLocation(userLocation);
                }
                this.locationInProgress = true;
            }
        },(error) => {
            //console.log(error);
            if(error.PERMISSION_DENIED !== undefined){
                
                this.httpClient.get(environment.location.clientsIpAddress).pipe(
                    switchMap((value:any) =>{
                        let ipAddress = value.ip;
                        let url = environment.location.geolocationByIpAddress;
                        url = url.replace('{ipAddress}',ipAddress);
                        return this.httpClient.get(url);
                    })
                )
                .subscribe({
                    next: (result:any) => {
                        if(result !== null){

                            let userLocation:UserLocation =  {
                                latitude: result.lat,
                                longitude: result.lon,
                                address: null,
                                city: result.city,
                                area: null,
                                displayName: result.city
                            };
            
                            this.updateUserLocation(userLocation);
                        }
                    },
                    error: err => console.log('Error occured in Ip address API ', err)
                })
            } else {
                console.log('Error occured in Navigator ',error);
            }
        });
    }
}