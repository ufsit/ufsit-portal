import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
// provides a layer of abstraction between the api and the rest of the frontend
export class RestService {
  private ngUnsubscribe = new Subject();

  baseUrl = '/api';

  // import the HttpClient so we can make requests
  constructor(private http: HttpClient) { }

  // basic get request
  private get(relativeUrl: string, params?: HttpParams): Observable<any> {
    return this.http.get(this.baseUrl + relativeUrl, {params: params});
  }

  // basic post request
  private post(relativeUrl: string, data: any = '', options: any = {}) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');
      console.log('The url you are trying to go to is: ' + this.baseUrl + relativeUrl);
    return this.http.post(this.baseUrl + relativeUrl, data, options);
  }

  // api call to log in a user, given his or her email and password
  public login(formData) {
    return this.post('/user/login', formData, {responseType: 'text'});
  }

  // api call to get a user's profile
  public getProfile(id?: number) {
    // if id is undefined, then a user is requesting their own profile
    if (id === undefined) {
      // return the user's profile data
      return this.get('/user/profile');
    // otherwise, a user is requesting another user's profile
    } else {
      // return the other user's profile data
      return this.get('/user/profile/' + id);
    }
  }

  // to validate a user's session
  public validateSession(): Observable<Response> {
    return this.get('/session/validate');
  }

  // makes an http request for a list of the members
  public user_list(variable: string): Observable<Response> {
    return this.get('/admin' + variable);
  }

  // api call to log out a user
  public logout() {
    return this.post('/session/logout');
  }

  // api call to register a user, given his or her name , email, password,
  // graduation year, and subscribe preferences
  public register(formData: {}) {
    return this.post('/user/register', formData, {responseType: 'text'});
  }

  public update(formData: {}) {
    return this.post('/user/profile', formData, {responseType: 'text'});
  }

  public signin(email: string) {
    return this.post('/event/sign_in', {email: email});
  }

  public getSignedRequest(file: Blob, name: string) {
    return this.get('/upload/sign', new HttpParams()
                                    .set('file-name', name)
                                    .set('file-type', file.type));
  }

  public uploadWriteup(data: string, ctfName: string, challengeName: string) {
    // return this.http.post(signedRequest, file);
    return this.post('/upload/writeup',
      {
        data: data,
        ctfName: ctfName,
        challengeName: challengeName
      }
    );
  }

}
