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
    const intervalPeriod = seconds;

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
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.startTimer(60);
    }, 0);
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
