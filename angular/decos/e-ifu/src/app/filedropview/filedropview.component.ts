import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UploadedFile } from '../fileupload-view/filemodel';
import { Subscription } from 'rxjs';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-filedropview',
  templateUrl: './filedropview.component.html',
  styleUrls: ['./filedropview.component.scss']
})

export class FiledropviewComponent implements OnInit, OnDestroy {
  @Input() file!: UploadedFile;
  displayedColumns: string[] = ['Key', 'Value'];
  detectionSubscription: Subscription = new Subscription;

  constructor(private ref: ChangeDetectorRef, private notifyService: NotificationService) {

  }

  ngOnInit(): void {
    this.ref.detach();
    this.detectionSubscription = this.notifyService.metadataChanged.subscribe((fileName) => {
      if(this.file.fileName == fileName) {
        this.ref.detectChanges();
      }
    })
  }

  ngOnDestroy(): void {
    this.detectionSubscription?.unsubscribe();
  }
}
