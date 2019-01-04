import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {

  private analyticsApi = 'http://localhost:3000/catalog';  // URL to web api

  constructor(private http: HttpClient) { }

  catalogItems = null;

  ngOnInit() {
    this.getCatalogItems()
    .subscribe(items => this.catalogItems = items);
  }

  getCatalogItems() : Observable<Object> {
    return this.http.get(this.analyticsApi)
    .pipe(
      tap(x => console.log('fetched items',x))
    );
  }

}
