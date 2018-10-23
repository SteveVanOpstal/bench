import {Component} from '@angular/core';
import {BenchMarkService} from '../services/benchmark/benchmark.service';

@Component({
  selector: 'bnch-benchmark',
  templateUrl: './benchmark.component.html',
  styleUrls: ['./benchmark.component.scss']
})
export class BenchmarkComponent {
  constructor(public benchmark: BenchMarkService) {}
}
