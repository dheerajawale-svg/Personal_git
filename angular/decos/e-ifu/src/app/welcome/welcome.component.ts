import { ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  title = 'e-ifu';
  radioValue: string | undefined;
  email: string | null | undefined;

  consentForm: FormGroup;

  constructor(private _formBuilder: FormBuilder, private _snackBar: MatSnackBar) {
    this.consentForm = _formBuilder.group({
      email: [this.email],
      purpose:['', Validators.required],
      checked: new FormControl(false)
    })
  }

  ngOnInit() {
    this.boxChanged(false);
  }

  radioSelected(event: MatRadioChange) {
    console.log(event);
    this.radioValue = event.value;
    // console.log(this.radioValue);
  }

  boxChanged(evchecked: any) {
    console.log(evchecked);
    if(!evchecked) {
      this.consentForm.controls["email"].setValidators([Validators.required, Validators.email]);
    }
    else {
      this.consentForm.controls["email"].setValidators(null);
    }
    this.consentForm.controls["email"].updateValueAndValidity();
  }

  onNgSubmit() {
    if(this.consentForm.invalid) {
      this.openSnackbar("Invalid Data!!!");
    }

    console.log(this.consentForm?.value);
    console.log(this.radioValue);
  }

  openSnackbar(message: string) {
    let snackBarRef = this._snackBar.open(message, 'Close', {
      horizontalPosition: "right",
      verticalPosition: "top",
      duration: 3000
    });

    snackBarRef.onAction().subscribe(() => {
      console.log('The snackbar action was triggered!');
    });

    snackBarRef.afterDismissed().subscribe(() => {
      console.log('The snackbar was dismissed');
    });
  }
}
