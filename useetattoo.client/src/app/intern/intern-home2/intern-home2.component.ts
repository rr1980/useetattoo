import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-intern-home2',
  templateUrl: './intern-home2.component.html',
  styleUrls: ['./intern-home2.component.scss'],
})
export class InternHome2Component {
  protected _ds = new MyDataSource();

  constructor() {}
}

export class MyDataSource extends DataSource<string | undefined> {
  private _length = 100000;
  private _pageSize = 5;
  private _cachedData = Array.from<string>({ length: this._length });
  private _fetchedPages = new Set<number>();
  private readonly _dataStream = new BehaviorSubject<(string | undefined)[]>(
    this._cachedData
  );
  private readonly _subscription = new Subscription();

  public connect(
    collectionViewer: CollectionViewer
  ): Observable<(string | undefined)[]> {
    this._subscription.add(
      collectionViewer.viewChange.subscribe((range) => {
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

  private _fetchPage(page: number): void {
    if (this._fetchedPages.has(page)) {
      return;
    }
    this._fetchedPages.add(page);

    // Use `setTimeout` to simulate fetching data from server.
    setTimeout(() => {

      console.debug('skip', page * this._pageSize);
      console.debug('take', this._pageSize);
      this._cachedData.splice(
        page * this._pageSize,
        this._pageSize,
        ...Array.from({ length: this._pageSize }).map(
          (_, i) => `Item #${page * this._pageSize + i}`
        )
      );
      this._dataStream.next(this._cachedData);
    }, Math.random() * 1000 + 200);
  }
}
