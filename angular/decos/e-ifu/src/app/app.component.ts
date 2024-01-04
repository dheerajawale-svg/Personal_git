import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { distinctUntilChanged, pluck } from 'rxjs';
import { NotificationService } from './services/notification.service';
// import * as metadatalist from '../app/test.json'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  isUserLoggedIn: boolean = false;

  showFiller = false;
  showNavText = false;

  constructor(private observer: BreakpointObserver,
              private router: Router, private ref: ChangeDetectorRef,
              private notifyService: NotificationService) {}

  sidenavWidth = 4.5;

  increase() {
    setTimeout(() => {
      this.showNavText = true;
      this.sidenavWidth = 15;
      this.ref.detectChanges();

    }, 1000);
  }
  decrease() {
    this.showNavText = false;
    this.sidenavWidth = 4.5;
  }

  isVisible: boolean = true;

  //#region Interface Impl

  ngOnInit() {
    this.notifyService.userEntered.subscribe((value) => {
      this.isUserLoggedIn = value;
    })
  }

  ngOnDestroy(): void {
  }

  //#endregion

}
