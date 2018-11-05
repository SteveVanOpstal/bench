import {Component, Input} from '@angular/core';
import * as c3 from 'c3';
import {BenchMarkResults} from 'src/app/services/benchmark/benchmark.service';

@Component({
  selector: 'bnch-line-chart',
  templateUrl: 'line-chart.component.html',
  styleUrls: ['line-chart.component.scss']
})
export class LineChartComponent implements Chart {
  @Input() size: number;

  chart = c3.generate({bindto: '#' + this.size, data: {}});

  update(_data: BenchMarkResults) {
    // this.chart.load(data);
  }
}
