import { Component } from '@angular/core';
import { FileHandle } from './drag.directive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'drag-n-drop';
  files: FileHandle[] = [];


  filesDropped(files: FileHandle[]): void {
    this.files = files;
    for(let file in files) {
      console.log(file);
    }
  }

  upload(): void {
    //get image upload file obj;
  }

}
