import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, delay, distinctUntilChanged, fromEvent, pluck, tap } from 'rxjs';
import { NotificationService } from './services/notification.service';
import { MatSidenav } from '@angular/material/sidenav';
// import * as metadatalist from '../app/test.json'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: false, read: ElementRef }, ) sidenav: ElementRef = {} as ElementRef;
  isUserLoggedIn: boolean = false;

  showFiller = false;
  showNavText = false;

  constructor(private ref: ChangeDetectorRef,
              private notifyService: NotificationService) {}

  sidenavWidth = 4.5;

  onOpen(isOpen : boolean) {
    // console.log(isOpen);
    // console.log(this.sidenav);
    fromEvent(this.sidenav.nativeElement, 'mouseenter')
    .pipe(delay(1000), tap(() => {
      this.sidenavWidth = 15;
      this.showNavText = true;
    }))
    .subscribe(res => {
      console.log(res);
    });
    // if(isOpen) {

    // }
  }

  increase() {
    // setTimeout(() => {
    //   this.showNavText = true;
    //   this.sidenavWidth = 15;
    //   this.ref.detectChanges();

    // }, 1000);
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
