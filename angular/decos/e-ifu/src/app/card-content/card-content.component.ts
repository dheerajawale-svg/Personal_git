import { Component } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SnackbarService } from '../snack-bar/snackbar.service';

@Component({
  selector: 'app-card-content',
  templateUrl: './card-content.component.html',
  styleUrls: ['./card-content.component.scss']
})
export class CardContentComponent {
  selected = 'option2';
  panelOpenState = false;
  favIcon = ['material-icons-outlined'];
  favSelected = false;
  // <div ng-class="[{true: 'material-icons favColor-active'}[true]]"></div>

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private _snackBarService: SnackbarService) {}

  onDownload() {

    this._snackBarService.openCustomSnackBar("New test Message", "Ok");

    // let snackBarRef = this._snackBar.open('Download Started', 'OK', {
    //   horizontalPosition: this.horizontalPosition,
    //   verticalPosition: this.verticalPosition
    // });

    // snackBarRef.onAction().subscribe(() => {
    //   console.log('The snackbar action was triggered!');
    // });

    // snackBarRef.afterDismissed().subscribe(() => {
    //   console.log('The snackbar was dismissed');
    // });

  }

  favIconClicked() {
    this.favSelected = !this.favSelected;
    if(this.favSelected) {
      this.favIcon = ['material-icons', 'favColor-active']
    }
    else {
      this.favIcon = ['material-icons-outlined']
    }

    // if(this.favIcon == "material-icons-outlined") {
    //   this.favIcon = "material-icons";
    //   console.log("Clicked!!!!!!")
    // }
    // else {
    //   this.favIcon = "material-icons-outlined";
    // }
  }
}
