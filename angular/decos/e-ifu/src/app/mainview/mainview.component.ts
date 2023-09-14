import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-mainview',
  templateUrl: './mainview.component.html',
  styleUrls: ['./mainview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainviewComponent implements AfterViewInit  {
  showFiller = false;

  ngAfterViewInit(): void {
  }
  sidenavWidth = 4;
  // ngStyle: string | undefined;


  increase() {
    this.sidenavWidth = 12;
  }
  decrease() {
    this.sidenavWidth = 4;
  }

}
