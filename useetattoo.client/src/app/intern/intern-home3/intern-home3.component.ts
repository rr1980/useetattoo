import { Component, OnInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { lastValueFrom } from 'rxjs';
import { ApiService } from '../../share/services/api.service';
import { RouteKeys } from '../../share/helper/route-keys.helper';
import { EventService } from 'src/app/share/services/event.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-intern-home3',
  templateUrl: './intern-home3.component.html',
  styleUrls: ['./intern-home3.component.scss'],
})
export class InternHome3Component {
  protected _dataSource: DataSource;
  protected _theme: string = 'light';

  constructor(
    private _apiService: ApiService,
    private _eventService: EventService,
    private _router: Router
  ) {
    this._onNewClick = this._onNewClick.bind(this);

    this._eventService.on('onThemeChange', (theme: any): void => {
      this._theme = theme;
    });

    this._dataSource = new DataSource({
      key: 'id',

      load: (loadOptions: any): any => {
        // console.debug('query', _query);
        return lastValueFrom(
          this._apiService.post(
            RouteKeys.Intern.Declaration.search,
            loadOptions
          )
        );
      },
    });
  }

  protected _onNewClick(e: any): void {
    this._router.navigate(['intern/newDeclaration']);
  }
}
