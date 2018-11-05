import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, reduce, scan} from 'rxjs/operators';
import {FileMetadata} from 'src/models/metadata.model';

import {GzipService} from './gzip.service';

export interface BenchMark {
  size$: Observable<number>;
  // run: () => void;
}

export class BenchMarkResult extends FileMetadata {
  duration: number;
}

export type BenchMarkResults = BenchMarkResult[];

@Injectable({providedIn: 'root'})
export class BenchMarkService implements BenchMark {
  size$ = this._gzip.size$;
  sizes$ = this._gzip.sizes$;

  run$: Observable<BenchMarkResults> = this._gzip.run().pipe(
      map((result) => {
        const resources = <PerformanceResourceTiming[]>performance.getEntriesByType('resource');
        if (resources.length) {
          const lastResource = resources[resources.length - 1];
          const duration = lastResource.responseEnd - lastResource.responseStart;
          return Object.assign(result, {duration});
        } else {
          throw Error('unknown duration');
        }
      }),
      scan<BenchMarkResult, any>((acc, value) => 
        acc.length ? [...acc, value] : [acc, value]
      ));

  constructor(private _gzip: GzipService) {}
}
