export class Metadata {
  files: FileMetadata[];
  size: number;
}

export class FileMetadata {
  fileName: string;
  originalSize: number;
  compressedSize: number;
  requestedRate: number;
  rate: number;
}
