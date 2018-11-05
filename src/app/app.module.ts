import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BenchmarkModule} from './benchmark/benchmark.module';
import {HeaderComponent} from './header/header.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [BrowserModule, HttpClientModule, BenchmarkModule],
  bootstrap: [AppComponent]
})
export class AppModule {
}
