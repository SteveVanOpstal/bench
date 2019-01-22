import {Component} from '@angular/core';
import * as p from '../../../package.json';

@Component({
  selector: 'bnch-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: 'header.component.html'
})
export class HeaderComponent {
  version = p.version;
}
