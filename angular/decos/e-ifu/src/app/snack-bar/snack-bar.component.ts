import { AfterViewInit, Component, Inject, ViewChild, inject } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { delay, interval, map, startWith, tap, throttleTime } from 'rxjs';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent implements AfterViewInit {
  value = 100;

  @ViewChild(MatProgressBar) progressBar!: MatProgressBar;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {

  }

  curSec: number = 0;

  startTimer(seconds: number) {
    const intervalPeriod = 60;

    const sub = interval(intervalPeriod)
      .pipe(
        // throttle for animation
        throttleTime(100),
        // business logic with event
        tap(val => {
          this.value = 100 - val * 100 / seconds;
          this.curSec = val;

          if (this.curSec === intervalPeriod) {
            this.data.snackBar.dismiss();
            sub.unsubscribe();
          }
        })
      )
      .subscribe();


    // const timer$ = interval(intervalPeriod);

    // const sub = timer$.subscribe((sec) => {
    //   this.value = 100 - sec * 100 / seconds;
    //   this.curSec = sec;

    //   // console.log('value: %d', this.value);
    //   // console.log('curSec: %d', this.curSec);

    //   if (this.curSec === intervalPeriod) {
    //     sub.unsubscribe();
    //     this.data.snackBar.dismiss();
    //   }
    // });
  }

  ngAfterViewInit() {

    setTimeout(() => {
      this.startTimer(55);
      // this.value = 0;
    }, 500);


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
