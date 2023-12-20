import { MatTableDataSource } from "@angular/material/table";
import { Observable } from "rxjs";

export interface UploadedFile {
  fileName: string;
  fileSize: number;
  progressVal: Observable<number>;
  actualFile:File;
  deleteDisabled: boolean;
  metadataPresent: boolean;
  metadataSource: MatTableDataSource<KvPair>;
}

export interface FileMetadata {
  fileName: string,
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
