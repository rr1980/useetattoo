import { Component, TemplateRef, ViewChild } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { ModalService } from './share/services/modal.service';
import { EventService } from './share/services/event.service';
import DataGrid from 'devextreme/ui/data_grid';
import config from 'devextreme/core/config';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('errorModal', { static: false })
  protected _errorModal?: TemplateRef<any>;

  protected _theme: string = 'light';
  protected _error?: any;

  constructor(
    private _modalService: ModalService,
    private _eventService: EventService
  ) {
    registerLocaleData(localeDe, 'de-DE', localeDeExtra);

    this._eventService.on('onThemeChange', (theme: any): void => {
      this._theme = theme;
    });

    this._modalService.on('error', (error: any): void => {
      this._error = error;
      console.debug('open popup error', error);

      // this._bs_modalService
      //   .open(this._errorModal, { ariaLabelledBy: 'modal-basic-title' })
      //   .result.then(
      //     (result) => {
      //       // this.closeResult = `Closed with: ${result}`;
      //     },
      //     (reason) => {
      //       // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      //     }
      //   );
    });

    DataGrid.defaultOptions({
      options: {
        columnAutoWidth: false,
        showColumnLines: true,
        showRowLines: false,
        showBorders: false,
        hoverStateEnabled: true,
        rowAlternationEnabled: true,
        allowColumnReordering: true,
        allowColumnResizing: true,
        columnResizingMode: 'widget',
        width: 100 + '%',
        height: 100 + '%',
        loadPanel: {
          enabled: false,
        },
        paging: {
          pageSize: 40,
        },
        scrolling: {
          useNative: true,
          mode: 'virtual',
          showScrollbar: 'always',
        },
        stateStoring: {
          savingTimeout: 0,
        },
      } as any,
    });
  }
}
