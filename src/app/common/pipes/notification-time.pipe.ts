import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'notificationTime'
})

export class NotificationTimePipe implements PipeTransform {
    transform(value: any, ...args: any[]) {
        if(value !== null) {
            let currentDate = new Date();
            let passedDate = new Date(value);
            
            let diffInMinutes = dateDifferenceInMinutes(passedDate,currentDate);
            let diffInHours = dateDifferenceInHours(passedDate,currentDate);
            let diffInDays = dateDifferenceInDays(passedDate,currentDate);
            if(diffInMinutes < 61) { //if value is less than hour then show minitues
                return `${diffInMinutes} mins ago`;
            } else if (diffInHours <= 24) {
                return `${diffInHours} hrs ago`;
            } else {
                return `${diffInDays} days ago`;
            }

        } else {
            throw Error("Value is not defined in the GetHours pipe");
        }
    }
}

const dateDifferenceInDays = (dateInitial, dateFinal) =>
    Math.abs(Math.round((dateFinal - dateInitial) / 86_400_000));

const dateDifferenceInHours = (dateInitial, dateFinal) =>
    Math.round((dateFinal - dateInitial) / 3_600_000);

const dateDifferenceInMinutes = (dateInitial, dateFinal) =>
    Math.round((dateFinal - dateInitial) / 60_000);