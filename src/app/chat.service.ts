import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private endpoint = 'http://localhost:9000/api/chats';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  private myDate = new Date();

  constructor(private http: HttpClient,
              private datePipe: DatePipe) {}

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }

  getUsers(): Observable<any> {
    return this.http
      .get(this.endpoint + '/getUsers')
      .pipe(map(this.extractData));
  }

  getChats(): Observable<any> {
    return this.http
      .get(this.endpoint + '/getMessages')
      .pipe(map(this.extractData));
  }

  insertUser(username: string): Observable<any> {
    const data = {
      name: username,
      date_time: this.datePipe.transform(this.myDate, 'yyyy-MM-dd')
    };

    return this.http
      .post<any>(this.endpoint + '/createUser', data, this.httpOptions)
      .pipe(
        tap((newHero: any) => this.log(`added hero w/ id=${newHero.id}`)),
        catchError(this.handleError<any>('addUser'))
      );
  }

  insertMessage(username: string, text: string): Observable<any> {
    const data = {
      name: username,
      message: text,
      date_time: this.datePipe.transform(this.myDate, 'yyyy-MM-dd')
    };

    return this.http
      .post<any>(this.endpoint + '/insertMessage', data, this.httpOptions)
      .pipe(
        tap((newHero: any) => this.log(`added hero w/ id=${newHero.id}`)),
        catchError(this.handleError<any>('addUser'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    // this.messageService.add(`HeroService: ${message}`);
  }
}
