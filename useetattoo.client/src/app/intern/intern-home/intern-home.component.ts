import { Component, ViewChild } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { lastValueFrom, tap } from 'rxjs';
import { ApiService } from '../../share/services/api.service';
import { RouteKeys } from '../../share/helper/route-keys.helper';
import { EventService } from 'src/app/share/services/event.service';
import { Router } from '@angular/router';
import { ConfirmHelper } from 'src/app/share/helper/confirm.helper';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';

@Component({
  selector: 'app-intern-home',
  templateUrl: './intern-home.component.html',
  styleUrls: ['./intern-home.component.scss'],
})
export class InternHomeComponent {
  @ViewChild('dxDataGrid', { static: false })
  private _dxDataGrid?: DxDataGridComponent;

  protected _dataSource: DataSource;
  protected _advancedSearch: boolean = false;

  protected _filterBtnOptions = {
    stylingMode: 'outlined',
    type: 'default',
    icon: 'undo',
    hint: 'Alle Filter zurücksetzen',
    onClick: (event: any): void => {
      if (this._dxDataGrid) {
        this._dxDataGrid.instance.clearSelection();
        this._dxDataGrid.instance.clearFilter();
        this._dxDataGrid.instance.clearSorting();
      }
    },
  };

  constructor(
    private _apiService: ApiService,
    private _eventService: EventService,
    private _router: Router
  ) {
    this._onNewClick = this._onNewClick.bind(this);
    this._onEditClick = this._onEditClick.bind(this);
    this._onRemoveClick = this._onRemoveClick.bind(this);
    this._onadvancedSearchValueChanged =
      this._onadvancedSearchValueChanged.bind(this);
    this._loadStateSource = this._loadStateSource.bind(this);
    this._saveStateSource = this._saveStateSource.bind(this);

    this._dataSource = new DataSource({
      key: 'id',

      load: (loadOptions: any): any => {
        // console.debug('query', _query);
        return lastValueFrom(
          this._apiService
            .post(RouteKeys.Intern.Declaration.search, loadOptions)
            .pipe(tap((res) => console.log(res)))
        );
      },
    });
  }

  protected _onNewClick(e: any): void {
    this._router.navigate(['intern/newDeclaration']);
  }

  protected _onEditClick(e: any): void {
    let _id = -1;
    if (e && e.row && e.row.data && e.row.data.id) {
      _id = e.row.data.id;
    } else if (e && e.data && e.data.id) {
      _id = e.data.id;
    } else {
      return;
    }

    this._router.navigate(['intern/showDeclaration', _id]);
  }
  protected _onRemoveClick(e: any): void {
    if (e && e.row && e.row.data && e.row.data.id) {
      ConfirmHelper.confirm('Wirklich löschen?', (): void => {
        this._apiService
          .post<any>(RouteKeys.Intern.Declaration.del, { id: e.row.data.id })
          .subscribe({
            next: (response: any) => {
              if (this._dxDataGrid) {
                this._dxDataGrid.instance.refresh();
              }
            },
            error: (err: any) => {
              throw err;
            },
          });
      });
    }
  }

  protected _onadvancedSearchValueChanged(e: any): void {
    this._advancedSearch = e.value;
    if (this._dxDataGrid) {
      this._dxDataGrid.instance.repaint();
      this._saveStateSource(this._dxDataGrid.instance.state());
    }
  }

  protected _loadStateSource(): any {
    let _state: any | null = null;
    const _stateString: string | null = localStorage.getItem(
      'declarationSearchA1'
    );
    if (_stateString) {
      const _state_loaded = JSON.parse(_stateString);
      _state = _state_loaded.state;
      this._advancedSearch = _state_loaded.showAdvancedSearch;
      _state.selectedRowKeys = [];
    }

    return _state || null;
  }

  protected _saveStateSource(state: any): void {
    state.selectedRowKeys = [];
    const _state = {
      state: state,
      showAdvancedSearch: this._advancedSearch,
    };
    localStorage.setItem('declarationSearchA1', JSON.stringify(_state));
  }
}
