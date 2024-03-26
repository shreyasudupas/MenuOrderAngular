import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Notification } from 'src/app/common/components/notification/notification';

@Injectable({
    providedIn:'root'
})

export class NotificationService{
    headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(private http: HttpClient) {}

    getAllNotifications = async (userId:string,skip:number,take:number) => {

        let url = environment.notification + '/' + userId;
        let params = new HttpParams().append('skip',skip)
        .append('limit',take);

        return await firstValueFrom(this.http.get<Notification[]>(url,{ params: params }))
            ;
    }

    updateNotification = (updateValue:Notification) : Observable<Notification> => {
        let url = environment.notification;
        let body = updateValue;

        return this.http.put<Notification>(url,body);
    }

    getNotificationCount = (userId:string) : Observable<number> => {
        let url = environment.notification + '/' + userId + '/count';
        return this.http.get<number>(url);
    }

    addNotification = (addNotification:Notification) : Observable<Notification> => {
        let url = environment.notification;
        let body = addNotification;

        return this.http.post<Notification>(url,body);
    }

    getNotificationCountByUserId = (userId:string) : Observable<number> => {
        let url = environment.notification;
        url = url.concat(`/${userId}/count`);

        return this.http.get<number>(url);
    }

}