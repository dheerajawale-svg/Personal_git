import { AfterViewInit, Component, Inject, ViewChild, inject } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { delay, interval, map, startWith } from 'rxjs';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent implements AfterViewInit {
  value = 100;
  @ViewChild(MatProgressBar) progressBar!: MatProgressBar;
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data:any) {

  }

  curSec: number = 0;

  startTimer(seconds: number) {
    const time = seconds;
    const timer$ = interval(60);

    const sub = timer$.subscribe((sec) => {
      this.value = 100 - sec * 100 / seconds;
      this.curSec = sec;

      // console.log('value: %d', this.value);
      // console.log('curSec: %d', this.curSec);

      if (this.curSec === seconds) {
        sub.unsubscribe();
      }

      if(this.value === 0) {
        // this.onAction();
      }
    });
  }

  ngAfterViewInit() {
    this.startTimer(40);
    // this.progressBar.animationEnd.pipe(
    //   map(() => this.onAction())
    // );
  }

  onAction() {
    this.data.snackBar.dismiss();
  }

  // ngAfterViewInit(): void {
  //   setInterval(() => {
  //     if(this.value != 0)
  //       this.value = this.value - 10;
  //   }, 1000)
  // }


}
