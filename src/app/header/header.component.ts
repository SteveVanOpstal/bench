import {Component} from '@angular/core';
import {version} from '../../../package';

@Component({
  selector: 'bnch-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: 'header.component.html'
})
export class HeaderComponent {
  version = version;
}
