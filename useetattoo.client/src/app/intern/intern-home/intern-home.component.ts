import { Component, QueryList, ViewChildren } from '@angular/core';
import { AuthService } from '../../share/services/auth.service';
import { ApiService } from '../../share/services/api.service';
import { RouteKeys } from '../../share/helper/route-keys.helper';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { Observable } from 'rxjs';
import {
  NgbdSortableHeaderDirective,
  SortColumn,
  SortDirection,
  SortEvent,
} from '../../share/directives/sortable.directive';
import { DeclarationService } from './intern-home.service';

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

@Component({
  selector: 'app-intern-home',
  templateUrl: './intern-home.component.html',
  styleUrls: ['./intern-home.component.scss'],
})
export class InternHomeComponent {
  protected _declarations?: Observable<any[]>;
  protected _totalCount?: Observable<number>;

  @ViewChildren(NgbdSortableHeaderDirective)
  protected _headers?: QueryList<NgbdSortableHeaderDirective>;

  constructor(
    private _authService: AuthService,
    private _apiService: ApiService,
    private _router: Router,
    protected _declarationService: DeclarationService
  ) {
    this._declarations = _declarationService.items$;
		this._totalCount = _declarationService.total$;
  }

  protected _onClickLogout(e: any): void {
    this._authService.logout();
  }

  protected _onClickTest0(e: any): void {
    console.debug('Test button clicked');

    this._apiService.post<any>(RouteKeys.Intern.Declaration.getAll).subscribe({
      next: (response: any) => {
        console.debug('Response', response);

        // for (let index = 0; index < response.length; index++) {
        //   const element = response[index];
        //   this._validate(element);
        // }
      },
      error: (err: any) => {
        throw err;
      },
    });
  }

  protected _onClickTest(e: any): void {
    console.debug('Test button clicked');

    this._apiService
      .post<any>(RouteKeys.Intern.Declaration.test, { id: e })
      .subscribe({
        next: (response: any) => {
          console.debug('Response', response);
        },
        error: (err: any) => {
          throw err;
        },
      });
  }

  protected _onClickTestClient(e: any): void {
    throw new Error('Test client error');
  }

  protected _onClickNew(e: any): void {
    this._router.navigate(['intern/newDeclaration']);
  }

  private _validate(item: any): void {
    const _s =
      item.signature.date +
      '|' +
      item.signature.data +
      '|' +
      item.signature.points +
      '|' +
      item.signature.image;
    const _orgHash = item.signature.hash;

    const _newHash = CryptoJS.SHA256(_s).toString();
    console.debug('_orgHash', _orgHash);
    console.debug('_newHash', _newHash);
    console.debug('_validate', _orgHash === _newHash, item);
  }

  //------------

  protected _onSort({ column, direction }: SortEvent): void {
    // resetting other headers
    if (this._headers) {
      this._headers.forEach((header) => {
        if (header.sortable !== column) {
          header.direction = '';
        }
      });

      this._declarationService.sortColumn = column;
      this._declarationService.sortDirection = direction;
    }
  }
}
