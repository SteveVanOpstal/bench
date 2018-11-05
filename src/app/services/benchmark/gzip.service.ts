import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {concat, Observable} from 'rxjs';
import {map, shareReplay, switchMap, take} from 'rxjs/operators';

import {FileMetadata, Metadata} from '../../../models/metadata.model';

import {BenchMark} from './benchmark.service';

@Injectable({providedIn: 'root'})
export class GzipService implements BenchMark {
  metadata$ = this._http.get(`files/metadata.json`).pipe(shareReplay());
  size$ = this.metadata$.pipe(map((metadata: Metadata) => metadata.size));
  files$ = this.metadata$.pipe(map((metadata: Metadata) => metadata.files));
  sizes$ = this.files$.pipe(map((files: FileMetadata[]) => files.map((file) => file.originalSize)));

  constructor(private _http: HttpClient) {}

  run(): Observable<FileMetadata> {
    return this.files$.pipe(switchMap((files) => {
      const tests = [];
      for (const file of files) {
        tests.push(this._getFile(file));
      }
      return concat(...tests);
    }));
  }

  _getFile(file: FileMetadata): Observable<FileMetadata> {
    return this._http
        .get(
            file.fileName,
            {responseType: 'text', headers: new HttpHeaders({'Cache-Control': 'no-cache'})})
        .pipe(map(() => file), take(1));
  }
}
