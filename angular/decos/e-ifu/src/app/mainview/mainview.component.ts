import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnDestroy, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { delay, distinctUntilChanged, filter, pluck } from 'rxjs';
import { MatRippleModule } from '@angular/material/core';

@UntilDestroy()
@Component({
  selector: 'app-mainview',
  templateUrl: './mainview.component.html',
  styleUrls: ['./mainview.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class MainviewComponent implements AfterViewInit, OnDestroy  {
  showFiller = false;
  showNavText = false;
  @ViewChild('drawer') matDrawer: any;

  constructor(private observer: BreakpointObserver, private router: Router) {}

  sidenavWidth = 4.5;
  // ngStyle: string | undefined;


  increase() {
    this.showNavText = true;
    this.sidenavWidth = 15;
  }
  decrease() {
    this.showNavText = false;
    this.sidenavWidth = 4.5;
  }

  isVisible: boolean = true;
  toggle() {
    this.isVisible = !this.isVisible;
    this.matDrawer.toggle();
  }

  //
  ngAfterViewInit() {
    this.observer
      .observe(['(min-width: 900px)'])
      .pipe(pluck('matches'), distinctUntilChanged())
      .subscribe((res) => {
        if(res) {
          this.isVisible = true;
          this.matDrawer.open();
          this.matDrawer.mode = "side";
        }
        else {
          this.matDrawer.mode = "over";
          this.matDrawer.close();
          this.isVisible = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.observer.ngOnDestroy();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

}
