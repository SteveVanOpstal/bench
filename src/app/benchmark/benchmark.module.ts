import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {BenchmarkComponent} from './benchmark.component';
import {LineChartComponent} from './charts/line-chart.component';
import {DeviceComponent} from './device/device.component';

@NgModule({
  declarations: [BenchmarkComponent, DeviceComponent, LineChartComponent],
  imports: [CommonModule],
  exports: [BenchmarkComponent]
})
export class BenchmarkModule {
}
