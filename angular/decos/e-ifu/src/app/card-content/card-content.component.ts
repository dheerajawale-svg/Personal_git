import { Component, Input } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SnackbarService } from '../snack-bar/snackbar.service';
import { eifu } from '../models/eifu';

@Component({
  selector: 'app-card-content',
  templateUrl: './card-content.component.html',
  styleUrls: ['./card-content.component.scss']
})
export class CardContentComponent {

  @Input() maincontent: eifu | undefined;

  selected = 'option2';
  panelOpenState = false;
  favIcon = ['material-icons-outlined'];
  favSelected = false;
  // <div ng-class="[{true: 'material-icons favColor-active'}[true]]"></div>

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private _snackBarService: SnackbarService) {}

  onDownload() {
    this._snackBarService.openCustomSnackBar("Starting Download...", "Ok");
  }

  onShare() {
    this._snackBarService.openSnackBar("Share started...")
  }

  favIconClicked() {
    this.favSelected = !this.favSelected;
    if(this.favSelected) {
      this.favIcon = ['material-icons', 'favColor-active']
    }
    else {
      this.favIcon = ['material-icons-outlined']
    }
  }
}
