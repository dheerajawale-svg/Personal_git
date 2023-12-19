import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, catchError, last, map, tap, EMPTY, scan, takeWhile, interval, takeLast, take } from 'rxjs';
import { FileMetadata, KvPair, UploadedFile } from './filemodel';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-fileupload-view',
  templateUrl: './fileupload-view.component.html',
  styleUrls: ['./fileupload-view.component.scss']
})
export class FileuploadViewComponent {
  @ViewChild("fileDropRef", { static: false }) fileDropEl!: ElementRef;

  uploadedFiles: UploadedFile[] = [];
  allMetadata = new MatTableDataSource<KvPair>();
  // allMetadata: FileMetadata[] = [
  //   {product: "Otosuite", languageCode: "EN", languageNameLocalized: "", productTitleLocalized:"", manualType:"", manualVariant:"", agileNo:"", shared:"", changelist:""},
  //   {product: "Aurical Aud", languageCode: "EN", languageNameLocalized: "", productTitleLocalized:"", manualType:"", manualVariant:"", agileNo:"", shared:"", changelist:""},
  //   {product: "Tymp", languageCode: "EN", languageNameLocalized: "", productTitleLocalized:"", manualType:"", manualVariant:"", agileNo:"", shared:"", changelist:""},
  //   {product: "PMM", languageCode: "EN", languageNameLocalized: "", productTitleLocalized:"", manualType:"", manualVariant:"", agileNo:"", shared:"", changelist:""},
  // ];


  displayedColumns: string[] = ['Key', 'Value'];

  constructor(private httpClient: HttpClient) {}

  /**
   * on file drop handler
   */
  onFileDropped($event: FileList) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler($event: Event) {
    const etarget = $event.target as HTMLInputElement;
    if(etarget.files) {
      this.prepareFilesList(etarget.files);
    }
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.uploadedFiles.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    this.uploadedFiles[index].progressVal = interval(80).pipe(
                map(() => 10),
                scan((a, b) => a + b),
                takeWhile((value) => value < 100, true)
    );

    this.uploadedFiles[index].progressVal.pipe(takeLast(1)).subscribe((val) => {
      // console.log('done')
      // console.log(val);
      this.uploadedFiles[index].deleteDisabled = false;
    });
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: FileList) {
    for (const item of Array.from(files)) {
      const uFile: UploadedFile = {
        fileName: item.name,
        fileSize: item.size,
        progress: 0,
        actualFile: item,
        progressVal: EMPTY,
        deleteDisabled: true
      }

      this.uploadedFiles.push(uFile);
    }

    if(this.fileDropEl != undefined) {
      if(files.length > 1) {
        for (let index = 0; index < files.length; index++) {
          this.uploadFilesSimulator(index);
        }
      }
      else if(files.length == 1) {
        this.uploadFilesSimulator(this.uploadedFiles.length-1);
      }
    }
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  onUpload() {
    const formData = new FormData();
    for(let file of this.uploadedFiles) {
      formData.append(file.fileName, file.actualFile);
    }

    this.httpClient.post<FileMetadata[]>('https://localhost:7132/Pdf', formData)
    .subscribe(res => {
      // this.allMetadata.data = res;

      for(let item of res) {
        for(let keyI in item) {
          let tempData = this.allMetadata.data;
          tempData.push({Key: keyI, Value: item[keyI as keyof FileMetadata]});
          this.allMetadata.data = tempData;
        }
      }
    });
  }

  private makeRequest(formData: FormData) : Observable<any> {
    const req = new HttpRequest('POST', 'https://localhost:7132/Pdf', formData, {
      reportProgress: true
    });

    return this.httpClient.request(req).pipe(
      map(event => console.log(this.getEventMessage(event, this.uploadedFiles[0].actualFile))),
      tap(message => this.showProgress(message)),
      last()
    );
  }

    /** Return distinct message for sent, upload progress, & response events */
  private getEventMessage(event: HttpEvent<any>, file: File) {
    switch (event.type) {
      case HttpEventType.Sent:
        return `Uploading file "${file.name}" of size ${file.size}.`;

      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        const percentDone = event.total ? Math.round(100 * event.loaded / event.total) : 0;
        return `File "${file.name}" is ${percentDone}% uploaded.`;

      case HttpEventType.Response:
        return `File "${file.name}" was completely uploaded!`;

      default:
        return `File "${file.name}" surprising upload event: ${event.type}.`;
    }
  }

  private showProgress(msg: any) {
    console.log(msg);
  }
}
