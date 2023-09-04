import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private _router: Router) {}

  submit() {
    if (this.form.valid) {
      this.submitEM.emit(this.form.value);
      this._router.navigateByUrl('/main')
    }
  }
  @Input() error: string | null | undefined;

  @Output() submitEM = new EventEmitter();
}
