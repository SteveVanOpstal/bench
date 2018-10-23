import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BenchmarkComponent} from './benchmark/benchmark.component';
import {HeaderComponent} from './header/header.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, BenchmarkComponent],
  imports: [BrowserModule],
  bootstrap: [AppComponent]
})
export class AppModule {
}
