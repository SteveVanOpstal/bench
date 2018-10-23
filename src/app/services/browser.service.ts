import {Injectable} from '@angular/core';
import {detect} from 'detect-browser';

@Injectable()
export class BrowserService {
  browser = detect();
}
