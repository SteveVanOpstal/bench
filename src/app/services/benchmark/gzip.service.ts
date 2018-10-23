import {Injectable} from '@angular/core';
import {BenchMark} from './benchmark.service';

@Injectable()
export class GzipService implements BenchMark {
  size = 5;

  run() {}
}
