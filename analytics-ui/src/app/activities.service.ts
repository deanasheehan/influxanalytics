import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  constructor(private http: HttpClient) { }

  private analyticsApi = 'http://localhost:3000/activities';  // URL to web api
 
  getActivities() : Observable<Object> {
    return this.http.get(this.analyticsApi)
    .pipe(
      tap(x => console.log('fetched items',x))
    );
  }

}

