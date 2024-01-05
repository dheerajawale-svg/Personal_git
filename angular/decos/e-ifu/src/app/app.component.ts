import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation, signal } from '@angular/core';
import { NotificationService } from './services/notification.service';
// import * as metadatalist from '../app/test.json'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  isUserLoggedIn: boolean = false;

  constructor(private notifyService: NotificationService) {}

  showNavText = signal<boolean>(false);
  sidenavWidth = signal<number>(4.5);
  timerId: any;
  increase() {
    this.timerId = setTimeout(() => {
      this.showNavText.set(true);
      this.sidenavWidth.set(10);
    }, 1000);
  }
  decrease() {
    if(this.timerId) {
      clearTimeout(this.timerId);
    }
    this.showNavText.set(false);
    this.sidenavWidth.set(4.5);
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
