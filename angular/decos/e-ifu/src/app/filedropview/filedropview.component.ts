import { Component, Input } from '@angular/core';
import { KvPair, UploadedFile } from '../fileupload-view/filemodel';
import { EMPTY_OBSERVER } from 'rxjs/internal/Subscriber';
import { EMPTY } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-filedropview',
  templateUrl: './filedropview.component.html',
  styleUrls: ['./filedropview.component.scss']
})
export class FiledropviewComponent {
  @Input() file!: UploadedFile;
  displayedColumns: string[] = ['Key', 'Value'];
}
