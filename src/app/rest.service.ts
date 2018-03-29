import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { FormGroup } from '@angular/forms';

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

  // api call to update a user's profile information
  public update(formData: FormGroup, url: string) {
    return this.post('/user/profile' + url, formData.value, {responseType: 'text'});
  }

  // api call by admin only to create a poll
  public createPoll(formData: FormGroup) {
    return this.post('/admin/poll', formData.value, {responseType: 'text'});
  }

  // api call to sign a user into an event
  public signin(email: string) {
    return this.post('/event/sign_in', {email: email});
  }

  // api call to get a signed url for an image
  public signImage(fileName: string, fileType: string) {
    return this.get('/upload/image', new HttpParams()
                                    .set('file-name', fileName)
                                    .set('file-type', fileType));
  }

  // api call to upload a writeup
  public uploadWriteup(data: string, ctfName: string, challengeName: string) {
    return this.post('/upload/writeup',
      {
        data: data,
        ctfName: ctfName,
        challengeName: challengeName
      }
    );
  }

  // api call to get a list of submitted writeups
  public getSubmittedWriteups() {
    return this.get('/writeups/submitted');
  }

  // api call to get a writeup
  public getWriteup(ctfName: string, challengeName: string, fileName: string) {
    return this.get('/writeups/get/' + ctfName + '/' + challengeName + '/'
                    + fileName);
  }

  // api call to upload an image directly
  public uploadImage(image: File, url: string) {
    const formData = new FormData();
    formData.append('image', image, image.name);
    return this.http.put(url, image, {headers: new HttpHeaders({
      'Content-Type': image.type,
      'x-amz-acl': 'private'
    })});
  }

  // api call to get a list of the candidates in an election
  public getCandidates() {
    return this.get('/voting/candidates');
  }
}
