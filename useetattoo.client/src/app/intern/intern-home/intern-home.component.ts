import { Component, OnInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { lastValueFrom, tap } from 'rxjs';
import { ApiService } from '../../share/services/api.service';
import { RouteKeys } from '../../share/helper/route-keys.helper';
import { EventService } from 'src/app/share/services/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intern-home',
  templateUrl: './intern-home.component.html',
  styleUrls: ['./intern-home.component.scss'],
})
export class InternHomeComponent {
  protected _dataSource: DataSource;

  constructor(
    private _apiService: ApiService,
    private _eventService: EventService,
    private _router: Router
  ) {
    this._onNewClick = this._onNewClick.bind(this);
    this._onEditClick = this._onEditClick.bind(this);
    this._onRemoveClick = this._onRemoveClick.bind(this);

    this._dataSource = new DataSource({
      key: 'id',

      load: (loadOptions: any): any => {
        // console.debug('query', _query);
        return lastValueFrom(
          this._apiService.post(
            RouteKeys.Intern.Declaration.search,
            loadOptions
          ).pipe(tap((res) => console.log(res)))
        );
      },
    });
  }

  protected _onNewClick(e: any): void {
    this._router.navigate(['intern/newDeclaration']);
  }

  protected _onEditClick(e: any): void {}
  protected _onRemoveClick(e: any): void {}
}
