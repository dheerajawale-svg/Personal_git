import { AfterViewInit, Component, Inject, OnDestroy, ViewChild, inject } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { EMPTY, Observable, Subscription, delay, interval, map, of, startWith, take, takeWhile, tap, throttleTime, timer } from 'rxjs';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent implements AfterViewInit, OnDestroy {
  value = 100;
  @ViewChild(MatProgressBar) progressBar!: MatProgressBar;
  countDownSub: Subscription | undefined;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngAfterViewInit() {
    const start = 100;
    this.countDownSub = timer(100, 50).pipe(
      map(i => start - i),
      take(start + 1)
    ).subscribe({
      next: i => this.value = i,
      complete: () => {
        timer(500).subscribe(() => this.onAction());
      }
    });
  }

  onAction() {
    this.data.snackBar.dismiss();
  }

  ngOnDestroy(): void {
    this.countDownSub?.unsubscribe();
  }
}
