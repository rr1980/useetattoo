import { Directive, EventEmitter, Input, Output } from '@angular/core';

export type SortColumn =
  | 'name'
  | 'vorname'
  | 'anrede'
  | 'geburtsdatum'
  | 'strasse'
  | 'plz'
  | 'ort'
  | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = {
  asc: 'desc',
  desc: '',
  '': 'asc',
};

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
})
export class NgbdSortableHeaderDirective {
  @Input() public sortable: SortColumn = '';
  @Input() public direction: SortDirection = '';
  @Output() public sort = new EventEmitter<SortEvent>();

  public rotate(): void {
    this.direction = rotate[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}
