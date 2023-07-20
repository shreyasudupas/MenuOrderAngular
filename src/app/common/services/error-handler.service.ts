import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs';
import { ErrorModel } from '../models/errorModel';

@Injectable({
    providedIn:'root'
})

export class ErrorHandlerSerivice {
    error = new BehaviorSubject<ErrorModel>(null);

    errorChangeDetection(){
        return this.error.asObservable();
    }

    setErrorMessage(errorMessage:string){
        this.error.next({
            errorMessage: errorMessage,
            errorTitle: 'Error occured inside the Application'
        });
    }
}