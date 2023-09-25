import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import {register} from 'swiper/element/bundle';

@Component({
  selector: 'app-root',
  // schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ui_carousal';
}
