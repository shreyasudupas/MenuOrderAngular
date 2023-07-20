import { ErrorHandler, NgZone } from '@angular/core';
import { Injectable } from '@angular/core';
import { ErrorHandlerSerivice } from '../services/error-handler.service';
//import { ModalService } from '../utilities/modal/modal.service';

@Injectable()

export class GlobalErrorHandler implements ErrorHandler {

    
    constructor(
        //private Modal:ModalService,
        private errorHandlerSerivice:ErrorHandlerSerivice,
        private ngZone:NgZone) {}

    handleError(error: any): void {
        //console.log(error);
        this.ngZone.run(()=>{
            
            //this.Modal.openModal('Error',error.message);
            this.errorHandlerSerivice.setErrorMessage(error.message);
            
        });
    }
}