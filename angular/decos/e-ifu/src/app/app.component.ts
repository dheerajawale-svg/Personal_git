import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'e-ifu';
  radioValue: number | undefined;
  email: string | null | undefined;
  @ViewChild('patientDetailsForm') patientDetailsForm?: NgForm;

  constructor() {
    this.email = 'dheeraj.awale@hotmail.com';
  }

  radioSelected(event: MatRadioChange) {
    console.log(event);
    this.radioValue = event.value;
    console.log(this.radioValue);
  }
}
