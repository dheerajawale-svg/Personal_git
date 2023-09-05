import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'e-ifu';
  radioValue: string | undefined;
  email: string | null | undefined;

  consentForm: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this.consentForm = _formBuilder.group({
      email: [this.email, Validators.required],
      purpose:['', Validators.required],
      checked: new FormControl(false)
    })
  }

  radioSelected(event: MatRadioChange) {
    console.log(event);
    this.radioValue = event.value;
    // console.log(this.radioValue);
  }

  onNgSubmit() {
    console.log(this.consentForm?.value);
    console.log(this.radioValue);
  }
}
