import { Component } from '@angular/core';

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
