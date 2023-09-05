import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { delay, filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

@UntilDestroy()
@Component({
  selector: 'app-mainview',
  templateUrl: './mainview.component.html',
  styleUrls: ['./mainview.component.css']
})
export class MainviewComponent {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  exampleForm!: FormGroup;
  checked: boolean | undefined;

  constructor(private observer: BreakpointObserver, private router: Router) {}

  ngOnInit() {
    this.exampleForm = new FormGroup({
    'second': new FormControl(''),
    'checked': new FormControl(false),
    'first': new FormControl('example')
    }, [this.validateIfChecked()]);
}


validateIfChecked(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
    const checked = form.get('checked');
    const second= form.get('second');
    if (checked && !second) {
        return {
        'err': true
        };
    }
    return null;
    }
}

  ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1), untilDestroyed(this))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });

      this.router.events
      .pipe(
        untilDestroyed(this),
        filter((e) => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        if (this.sidenav.mode === 'over') {
          this.sidenav.close();
        }
      });
  }
}
