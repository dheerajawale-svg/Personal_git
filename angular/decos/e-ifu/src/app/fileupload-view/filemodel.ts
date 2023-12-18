import { Observable } from "rxjs";

export interface UploadedFile {
  fileName: string;
  fileSize: number;
  progress: number;
  progressVal: Observable<number>;
  actualFile:File;
}
