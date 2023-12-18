import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, interval, map, mapTo, scan, takeLast, takeWhile } from 'rxjs';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  title = 'e-ifu';
  radioValue: string | undefined;
  email: string | null | undefined;
  progress: Observable<number> | undefined;
  consentForm: FormGroup;

  constructor(private _formBuilder: FormBuilder,
              private _snackBar: MatSnackBar,
              private elementRef: ElementRef,
              private _router: Router) {
    this.consentForm = _formBuilder.group({
      email: [this.email],
      purpose:['', Validators.required],
      checked: new FormControl(false)
    })
  }

  ngOnInit() {
    this.boxChanged(false);
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.ownerDocument
            .body.style.backgroundColor = 'whitesmoke';
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
    else {

      this.progress = interval(100).pipe(
        map(() => 10),
        scan((a, b) => a + b),
        takeWhile((value) => value < 100, true)
      );
      this.progress.pipe(takeLast(1)).subscribe((_) => {
        console.log('done')
        this._router.navigate(['main']);
      });
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
