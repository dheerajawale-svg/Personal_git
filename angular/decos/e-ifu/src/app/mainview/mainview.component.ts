import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { delay, filter } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-mainview',
  templateUrl: './mainview.component.html',
  styleUrls: ['./mainview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainviewComponent implements AfterViewInit  {
  showFiller = false;
  showNavText = false;
  @ViewChild('drawer') matDrawer: any;

  // constructor(private observer: BreakpointObserver, private router: Router) {}

  sidenavWidth = 4.5;
  // ngStyle: string | undefined;


  increase() {
    this.showNavText = true;
    this.sidenavWidth = 12;
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
    // this.observer
    //   .observe(['(width: 800px)'])
    //   .pipe(delay(1), untilDestroyed(this))
    //   .subscribe((res) => {
    //     console.log("Entered...1");
    //     if (res.matches) {
    //       //todo close
    //       this.toggle();
    //     }
    //   });

    //   this.router.events
    //   .pipe(
    //     untilDestroyed(this),
    //     filter((e) => e instanceof NavigationEnd)
    //   )
    //   .subscribe(() => {
    //     console.log("Entered...2");
    //     //todo close
    //     this.toggle();
    //   });
  }

}
