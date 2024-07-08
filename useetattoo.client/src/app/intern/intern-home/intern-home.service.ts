import { Injectable, PipeTransform } from '@angular/core';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { DecimalPipe } from '@angular/common';
import { debounceTime, delay, map, switchMap, tap } from 'rxjs/operators';
import {
  SortColumn,
  SortDirection,
} from '../../share/directives/sortable.directive';
import { ApiService } from '../../share/services/api.service';
import { RouteKeys } from '../../share/helper/route-keys.helper';

interface SearchResult {
  items: any[];
  total: number;
}

interface State {
  // page: number;
  // pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number): number =>
  v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

const sort = (items: any[], column: SortColumn, direction: string): any[] => {
  if (direction === '' || column === '') {
    return items;
  } else {
    return [...items].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
};

const matches = (item: any, term: string, pipe: PipeTransform): any => {
  return (
    item.name.toLowerCase().includes(term.toLowerCase()) ||
    item.vorname.toLowerCase().includes(term.toLowerCase())
    // pipe.transform(item.population).includes(term)
  );
};

@Injectable({ providedIn: 'root' })
export class DeclarationService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _items$ = new BehaviorSubject<any[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _allItems: any = [];

  private _state: State = {
    // page: 1,
    // pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
  };

  constructor(private _pipe: DecimalPipe, private _apiService: ApiService) {
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe((result) => {
        this._items$.next(result.items);
        this._total$.next(result.total);
      });

    this._apiService.post<any>(RouteKeys.Intern.Declaration.getAll).subscribe({
      next: (response: any) => {
        this._allItems = response;
        this._search$.next();
      },
      error: (err: any) => {
        throw err;
      },
    });
  }

  public get items$(): Observable<any[]> {
    return this._items$.asObservable();
  }
  public get total$(): Observable<number> {
    return this._total$.asObservable();
  }
  public get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }
  // public get page(): number {
  //   return this._state.page;
  // }
  // public get pageSize(): number {
  //   return this._state.pageSize;
  // }
  public get searchTerm(): string {
    return this._state.searchTerm;
  }

  // public set page(page: number) {
  //   this._set({ page });
  // }
  // public set pageSize(pageSize: number) {
  //   this._set({ pageSize });
  // }
  public set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }
  public set sortColumn(sortColumn: SortColumn) {
    this._set({ sortColumn });
  }
  public set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  private _set(patch: Partial<State>): void {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  // private _search(): Observable<SearchResult> {
  //   // const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;
  //   const { sortColumn, sortDirection,searchTerm } = this._state;

  //   // 1. sort
  //   let items = sort(this._allItems, sortColumn, sortDirection);

  //   // 2. filter
  //   items = items.filter((item) => matches(item, searchTerm, this._pipe));
  //   const total = items.length;

  //   // 3. paginate
  //   items = items.slice(
  //     (page - 1) * pageSize,
  //     (page - 1) * pageSize + pageSize
  //   );
  //   return of({ items, total });
  // }

  private _search(): Observable<SearchResult> {
    const { sortColumn, sortDirection, searchTerm } = this._state;

    return this._apiService.post<any>(RouteKeys.Intern.Declaration.getAll).pipe(
      map((response) => {
        // console.debug('Response', response);

        // 1. sort
        let items = sort(response, sortColumn, sortDirection);

        // 2. filter
        items = items.filter((item) => matches(item, searchTerm, this._pipe));
        const total = items.length;

        // 3. paginate
        // items = items.slice(
        //   (page - 1) * pageSize,
        //   (page - 1) * pageSize + pageSize
        // );

        return { items, total };
      })
    );
  }
}
