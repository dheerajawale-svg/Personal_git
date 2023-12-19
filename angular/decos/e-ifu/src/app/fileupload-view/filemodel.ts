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
  languageCode: string,
  languageNameLocalized: string,
  productTitleLocalized: string,
  product: string,
  manualType: string,
  manualVariant: string,
  agileNo: string,
  shared: string,
  changelist: string,
}

export interface KvPair {
  Key: string,
  Value: string;
}
