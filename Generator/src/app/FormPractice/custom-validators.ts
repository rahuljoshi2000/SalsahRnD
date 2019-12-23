import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

export class CustomValidators {
  static invalidProjectName(control: FormControl): {[s: string]: boolean} {
    if (control.value === 'Test') {
      //console.log("Test text found, invalid input");
      return {'invalidProjectName': true};
    }
    //console.log("V1:Valid input");
    //console.log(control);
    return null;
  }

  static asyncInvalidProjectName(control: FormControl): Promise<any> | Observable<any> {


    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'Testproject') {
          //console.log("V2:In valid input");
          resolve({'invalidProjectName': true});
        } else {
          //console.log("V2:Valid input");
          resolve(null);
        }
      }, 2000);
    })
    return promise;
  }
}
