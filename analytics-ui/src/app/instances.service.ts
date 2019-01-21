import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InstancesService {

  private analyticsApi = 'http://localhost:3000/instances';  // URL to web api

  constructor(private http: HttpClient) { }

  getInstances() : Observable<Object> {
    return this.http.get(this.analyticsApi)
    .pipe(
      tap(x => console.log('fetched instances',x))
    );
  }

  execute (instance,body) {
    console.log('instance service execute',instance)
     return this.http.post(this.analyticsApi+'/'+ instance + '/execute',body)
    .pipe(
      tap(x => console.log('instance executed',x))
    );
  }

}
