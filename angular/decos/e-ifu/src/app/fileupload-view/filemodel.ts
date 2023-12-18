import { Observable } from "rxjs";

export interface UploadedFile {
  fileName: string;
  fileSize: number;
  progress: number;
  progressVal: Observable<number>;
  actualFile:File;
  deleteDisabled: boolean;
}

export interface FileMetadata {
  LanguageCode: string,
  LanguageNameLocalized: string,
  ProductTitleLocalized: string,
  Product: string,
  ManualType: string,
  ManualVariant: string,
  AgileNo: string,
  Shared: string,
  Changelist: string,
}
