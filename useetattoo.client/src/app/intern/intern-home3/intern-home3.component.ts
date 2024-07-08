import { Component, OnInit } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { lastValueFrom } from 'rxjs';
import { ApiService } from '../../share/services/api.service';
import { RouteKeys } from '../../share/helper/route-keys.helper';
@Component({
  selector: 'app-intern-home3',
  templateUrl: './intern-home3.component.html',
  styleUrls: ['./intern-home3.component.scss'],
})
export class InternHome3Component {
  protected _dataSource: DataSource;

  constructor(private _apiService: ApiService) {
    this._dataSource = new DataSource({
      key: 'id',

      load: (loadOptions: any): any => {
        // console.debug('query', _query);
        return lastValueFrom(this._apiService.post(RouteKeys.Intern.Declaration.search, loadOptions));
      },
    });
  }
}
