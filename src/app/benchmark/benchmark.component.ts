import {Component, OnDestroy} from '@angular/core';
import * as c3 from 'c3';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';

import {BenchMarkResult, BenchMarkService} from '../services/benchmark/benchmark.service';

// interface BenchMarkResultsColumns {
//   columns: any;
// }

@Component({
  selector: 'bnch-benchmark',
  templateUrl: './benchmark.component.html',
  styleUrls: ['./benchmark.component.scss']
})
export class BenchmarkComponent implements OnDestroy {
  run$: Observable<any[]> = this.benchmark.run$.pipe(map((results) => {
    const columns = [];
    for (const result of results) {
      const columnIndex = columns.findIndex(
          (column) => column.length ? column[0] === this._getTitle(result) : false);
      if (columnIndex < 0) {
        columns.push([this._getTitle(result)]);
      } else {
        columns[columnIndex].push(result.duration);
      }
    }
    return columns;
  }));

  runSubscription: Subscription;

  chart;

  // @ViewChildren(LineChartComponent) charts: QueryList<LineChartComponent>;

  constructor(public benchmark: BenchMarkService) {}

  run() {
    if (this._runSubscribed()) {
      return;
    }
    this.runSubscription = this.run$.subscribe((columns) => {
      if (!this.chart) {
        this.chart = c3.generate({bindto: '#chart', data: {columns: []}});
      } else {
        // this._updateCharts(results)
        this.chart.load({columns});
      }
    });
  }

  ngOnDestroy() {
    if (this._runSubscribed()) {
      this.runSubscription.unsubscribe();
    }
  }

  private _runSubscribed() {
    return this.runSubscription ? !this.runSubscription.closed : false;
  }

  private _getTitle(result: BenchMarkResult) {
    return result.originalSize.toString();
  }

  // private _updateCharts(results: BenchMarkResultsMap) {
  //   for (const size of Object.keys(results)) {
  //     const result = results[size];
  //     this._updateChart(parseInt(size, 10), result);
  //   }
  // }

  // private _updateChart(size: number, data: BenchMarkResults) {
  //   const chart = this.charts.find((c) => c.size === size);
  //   chart.update(data);
  // }
}
