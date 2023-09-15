import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-view',
  templateUrl: './filter-view.component.html',
  styleUrls: ['./filter-view.component.scss']
})
export class FilterViewComponent {
  @Input() isVisible: boolean | undefined;
  @Output() drawerClosedEvent = new EventEmitter<boolean>();
  favoriteSeason: string | undefined;
  seasons: string[] = ['Otosuite', 'Otobase', 'Otosuite Reports', 'Otoscan'];

  close() {
    this.isVisible = false;
    this.drawerClosedEvent.emit(true);
  }
}
