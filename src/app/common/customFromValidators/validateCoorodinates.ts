import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const validateCoordinates = () : ValidatorFn => {
    return (control: AbstractControl) : ValidationErrors | null => {
        //console.log('Coordinates validator called');
      if(!isNaN(control.value)){
        return null;
      }

      return { inCorrectCoordinates: true }
    };
  }