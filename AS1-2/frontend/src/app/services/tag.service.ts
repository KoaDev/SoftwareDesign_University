import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TagService {

  private url = "http://localhost:3000/api/tags";

  constructor(private http: HttpClient) { }

  
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log(token);
    return new HttpHeaders({
      'Authorization': `${token}`,
    });
  }

  findTagByName(name: string): Observable<Tag | undefined> {
    return this.http.get<Tag[]>(this.url).pipe(
      map((tags) => tags.find((tag) => tag.name === name))
    );
  }
  

  get() : Observable<Array<Tag>> {
    return this.http.get<Array<Tag>>(this.url, { headers: this.getAuthHeaders() });
  }

  post(tag: Tag): Observable<Tag> {
    return this.http.post<Tag>(this.url, tag, { headers: this.getAuthHeaders() }).pipe(
        map((response: Tag) => {
            // Directly return the response if it's already in the expected format
            return response;
        }),
        catchError(this.handleError)
    );
}

private handleError(error: any) {
  console.error('An error occurred:', error);
  return throwError(error);
}

}
