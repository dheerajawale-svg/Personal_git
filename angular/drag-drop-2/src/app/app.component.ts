import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, catchError, last, map, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
  uploadedFiles: UploadedFile[] = [];

  constructor(private httpClient: HttpClient) {}

  /**
   * on file drop handler
   */
  onFileDropped($event: FileList) {
    console.log($event);
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler($event: Event) {
    const etarget = $event.target as HTMLInputElement;

    this.prepareFilesList(etarget.files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    if (this.uploadedFiles[index].progress < 100) {
      console.log("Upload in progress.");
      return;
    }
    this.uploadedFiles.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.uploadedFiles.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.uploadedFiles[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            // this.files[index].progress += 10;
            this.uploadedFiles[index].progress +=10;
          }
        }, 100);
      }
    }, 500);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: FileList) {
    for (const item of Array.from(files)) {
      if(this.uploadedFiles.some(x => x.fileName === item.name)) {
        continue;
      }
      const uFile: UploadedFile = {
        fileName: item.name,
        fileSize: item.size,
        progress: 0,
        actualFile: item
      }

      this.uploadedFiles.push(uFile);
    }

    if(this.fileDropEl != undefined) {
      this.fileDropEl.nativeElement.value = "";
      this.uploadFilesSimulator(0);
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

    console.log('sending request');

    // this.makeRequest(formData).subscribe();

    this.httpClient.post('https://localhost:7132/Pdf', formData)
    .subscribe(res => {
      console.log(res);
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

  private showProgress(msg) {
    console.log(msg);
  }
}

export interface UploadedFile {
  fileName: string;
  fileSize: number;
  progress: number;
  actualFile:File;
}
