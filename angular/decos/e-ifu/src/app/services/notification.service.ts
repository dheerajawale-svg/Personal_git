import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  metadataChanged = new Subject<string>();
  userEntered = new BehaviorSubject<boolean>(false);

  constructor() { }
}
