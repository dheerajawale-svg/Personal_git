import { Component, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-sample',
  templateUrl: './form-sample.component.html',
  styleUrls: ['./form-sample.component.css']
})
export class FormSampleComponent implements OnInit {
  myForm!: FormGroup;
  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.myForm = this.fb.group({
      myCheckbox: [''],
      myEmailField: ['', [
        Validators.maxLength(250),
         Validators.minLength(5),
         Validators.pattern(/.+@.+\..+/)
         ]]
    });

    this.myForm.get('myCheckbox')?.valueChanges
    .subscribe(value => {
      if(value) {
        this.myForm.get('myEmailField')?.setValidators(Validators.required)
      } else {
        this.myForm.get('myEmailField')?.clearValidators();
      }
    }
);
  }

  onSubmit() {
    console.log(this.myForm.value);
  }

}
