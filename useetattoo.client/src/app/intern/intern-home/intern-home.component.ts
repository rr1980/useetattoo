import { Component, QueryList, ViewChildren } from '@angular/core';
import { AuthService } from '../../share/services/auth.service';
import { ApiService } from '../../share/services/api.service';
import { RouteKeys } from '../../share/helper/route-keys.helper';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { BehaviorSubject, Observable, Subscription, take } from 'rxjs';
import {
  NgbdSortableHeaderDirective,
  SortColumn,
  SortDirection,
  SortEvent,
} from '../../share/directives/sortable.directive';
import { DeclarationService } from './intern-home.service';
import { DataSource, CollectionViewer } from '@angular/cdk/collections';

interface State {
  // page: number;
  // pageSize: number;
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
  protected _ds: MyDataSource;

  @ViewChildren(NgbdSortableHeaderDirective)
  protected _headers?: QueryList<NgbdSortableHeaderDirective>;

  constructor(
    private _authService: AuthService,
    private _apiService: ApiService,
    private _router: Router
  ) {
    this._ds = new MyDataSource(this._apiService);
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

      // this._declarationService.sortColumn = column;
      // this._declarationService.sortDirection = direction;
      this._ds.setSort(column, direction);
    }
  }
}

export class MyDataSource extends DataSource<any | undefined> {
  private _length = 1;
  private _pageSize = 5;

  private _cachedData = Array.from<any>({ length: this._length });
  private _fetchedPages = new Set<number>();

  private readonly _dataStream = new BehaviorSubject<(any | undefined)[]>(
    this._cachedData
  );
  private readonly _subscription = new Subscription();

  private _state: State = {
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  };

  constructor(private _apiService: ApiService) {
    super();
  }

  public setSort(column: SortColumn, direction: SortDirection): void {
    this._state.sortColumn = column;
    this._state.sortDirection = direction;
    this._go();
  }

  public get searchTerm(): string {
    return this._state.searchTerm;
  }

  public set searchTerm(searchTerm: string) {
    this._state.searchTerm = searchTerm;
    this._go();
  }

  public connect(
    collectionViewer: CollectionViewer
  ): Observable<(any | undefined)[]> {
    this._subscription.add(
      collectionViewer.viewChange.subscribe(async (range) => {
        const startPage = this._getPageForIndex(range.start);
        const endPage = this._getPageForIndex(range.end - 1);
        for (let i = startPage; i <= endPage; i++) {
          this._fetchPage(i);
        }
      })
    );
    return this._dataStream;
  }

  public disconnect(): void {
    this._subscription.unsubscribe();
  }

  private _getPageForIndex(index: number): number {
    return Math.floor(index / this._pageSize);
  }

  private _go(): void{
    this._length = 1;
    this._cachedData = Array.from<any>({ length: this._length });
    this._fetchedPages = new Set<number>();
    this._dataStream.next(this._cachedData);
  }

  private _fetchPage(page: number): void {
    if (this._fetchedPages.has(page)) {
      console.debug('Page already fetched', page);
      return;
    }
    this._fetchedPages.add(page);

    this._apiService
      .post<any>(RouteKeys.Intern.Declaration.search, {
        skip: page * this._pageSize,
        take: this._pageSize,
        searchTerm: this._state.searchTerm,
        sortColumn: this._state.sortColumn,
        sortDirection: this._state.sortDirection,
      })
      .subscribe({
        next: (response: any) => {
          console.debug('Response', response);
          if (this._length !== response.totalCount) {
            this._length = response.totalCount;
            this._cachedData = Array.from<any>({ length: this._length });
          }

          this._cachedData.splice(
            page * this._pageSize,
            this._pageSize,
            ...response.items
          );
          this._dataStream.next(this._cachedData);
        },
        error: (err: any) => {
          throw err;
        },
      });
  }
}
