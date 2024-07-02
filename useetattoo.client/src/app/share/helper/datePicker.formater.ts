import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  NgbDateParserFormatter,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';

import { Component, Inject, LOCALE_ID } from '@angular/core';

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  private readonly _DELIMITER = '-';

  constructor(@Inject(LOCALE_ID) private _locale: string) {
    super();
  }

  public parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this._DELIMITER);

      console.debug('date', date);

      return {
        year: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        day: parseInt(date[2], 10),
      };
    }
    return null;
  }

  public format(date: NgbDateStruct | null): string {
    const _date = date ? date.month + '.' + date.day + '.' + date.year : '';
    if (_date) {
      return formatDate(_date, 'dd.MM.yyyy', this._locale);
    } else {
      return '';
    }
  }
}
