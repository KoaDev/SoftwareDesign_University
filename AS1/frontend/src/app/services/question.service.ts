import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Question } from '../models/question';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private url = "http://localhost:3000/api/questions/";

  constructor(private http: HttpClient) { }

  
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log(token);
    return new HttpHeaders({
      'Authorization': `${token}`,
    });
  }

  get() : Observable<Array<Question>> {
    return this.http.get<Array<Question>>(this.url, { headers: this.getAuthHeaders() });
  }

  getbyid(_id : string) : Observable<Question> {
    return this.http.get<Question>(this.url + _id, { headers: this.getAuthHeaders() });
  }

  post(task : Question) : Observable<Question> {
    return this.http.post<Question>(this.url, task, { headers: this.getAuthHeaders() });
  }

  put(task : Question) : Observable<Question> {
    return this.http.put<Question>(this.url + task._id, task, { headers: this.getAuthHeaders() });
  }

//router.delete('/questions/:questionId', auth, questionController.deleteQuestion);

  delete(_id : string) : Observable<void> {
    return this.http.delete<void>(this.url + _id, { headers: this.getAuthHeaders() });
  }

  //router.post('/questions/:questionId/vote', auth, questionController.voteQuestion);

  voteQuestion(_id : string, vote : string) : Observable<void> {
    const body = { vote: vote, _id : _id };
    return this.http.post<void>("http://localhost:3000/api/questions/" + _id + "/vote", body, { headers: this.getAuthHeaders() });
  }
}
