import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from './snack-bar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private _snackBar: MatSnackBar) { }

  openCustomSnackBar(message: string, action: string) {
    this._snackBar.openFromComponent(SnackBarComponent, {
      // duration: 3000,
      data: {
        message: message,
        action: action,
        snackBar: this._snackBar
      },
      panelClass: 'success-snackbar'
    });
  }
}
