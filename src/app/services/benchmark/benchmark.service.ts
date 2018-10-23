import {Injectable} from '@angular/core';

export interface BenchMark {
  size: number;
  run: () => void;
}

@Injectable()
export class BenchMarkService implements BenchMark {
  size = 10;

  run() {}
}
