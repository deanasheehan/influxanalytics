import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  private analyticsApi = 'http://localhost:3000/catalog';  // URL to web api

  constructor(private http: HttpClient) { }

  getCatalogItems() : Observable<Object> {
    return this.http.get(this.analyticsApi)
    .pipe(
      tap(x => console.log('fetched items',x))
    );
  }


  getItemByName (imageName,callback) {
    this.getCatalogItems()
      .subscribe(items => {
        let itemsArray = (items as []);
        for (let i = 0; i < itemsArray.length; i++) {
          if (items[i].imageName == imageName) {
            return callback(null,items[i]);
          }
        }
        return callback(new Error('not found'))
      });
  }
}
