import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Question } from '../models/question';
import { Answer } from '../models/answer';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  [x: string]: any;

  private url = "http://localhost:3000/api/questions/";

  constructor(private http: HttpClient) { }

  
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log(token);
    return new HttpHeaders({
      'Authorization': `${token}`,
    });
  }

  getAnswersByQuestionId(_id : string) : Observable<Array<Answer>> {
    return this.http.get<Array<Answer>>(this.url + _id + "/answers", { headers: this.getAuthHeaders() });
  }

  postAnswer(_id : string, answer : Answer) : Observable<Answer> {
    return this.http.post<Answer>(this.url + _id + "/answers", answer, { headers: this.getAuthHeaders() });
  }


  deleteAnswer(_id : string) : Observable<Answer> {
    return this.http.delete<Answer>("http://localhost:3000/api/answers/" + _id, { headers: this.getAuthHeaders() });
  }


  voteAnswer(_id : string, vote : string) : Observable<void> {
    const body = { vote: vote, _id : _id };
    return this.http.post<void>("http://localhost:3000/api/answers/" + _id + "/vote", body, { headers: this.getAuthHeaders() });
  }


  updateAnswer(_id : string, answer : Answer) : Observable<Answer> {
    return this.http.put<Answer>("http://localhost:3000/api/answers/" + _id, answer, { headers: this.getAuthHeaders() });
  }

}
