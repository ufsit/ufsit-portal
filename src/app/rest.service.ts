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
        return this.http.get(this.baseUrl + relativeUrl, { params: params });
    }

    // basic post request
    private post(relativeUrl: string, data: any = '', options: any = {}) {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.baseUrl + relativeUrl, data, options);
    }

    // api call to log in a user, given his or her email and password
    public login(formData) {
        return this.post('/user/login', formData, { responseType: 'text' });
    }

    // to validate a user's session
    public validateSession(): Observable<Response> {
        return this.get('/session/validate');
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

    // request list of custom admin-added tiles for home page
    public customTiles(): Observable<Response> {
        return this.get('/app/custom_tiles');
    }

    // analytics track user clicks
    public customTileClick(id) {
        this.post('/app/tile_click', { id }, { responseType: 'text' }).subscribe();
    }

    // admin can add new custom tiles
    public addTile(item) {
        this.post('/admin/add_tile', item, { responseType: 'text' }).subscribe();
    }

    // admin can remove previously added custom tiles
    public deleteTile(id) {
        this.post('/admin/delete_tile', { id }, { responseType: 'text' }).subscribe();
    }

    // api call to register a user, given his or her name, email, password,
    // graduation year, and subscribe preferences
    public register(formData: {}) {
        return this.post('/user/register', formData, { responseType: 'text' });
    }

    public update(formData: FormGroup, url: string) {
        return this.post('/user/profile' + url, formData.value, { responseType: 'text' });
    }

    // makes an http request for a list of the members
    public userList(relativeUrl: string): Observable<Response> {
        return this.get('/admin' + relativeUrl);
    }

    // api call to log out a user
    public logout() {
        return this.post('/session/logout');
    }

    // api call to sign a user into an event
    public signin(email: string) {
        return this.post('/event/sign_in', { email: email });
    }

    // api call to get a signed url for a file
    public signFile(fileName: string, fileType: string) {
        return this.get('/upload/file', new HttpParams()
            .set('file-name', fileName)
            .set('file-type', fileType));
    }

    // api call to upload a writeup
    public uploadWriteup(data: string, writeupName: string, writeupId: number) {
        return this.post('/upload/writeup',
            {
                data: data,
                writeupName: writeupName,
                writeupId: writeupId
            }
        );
    }

    // api call to get a list of submitted writeups
    public getSubmittedWriteups() {
        return this.get('/writeups/submitted');
    }

    // api call to get a writeup
    public getWriteup(id: number) {
        return this.get('/writeups/get/' + id);
    }

    // api call to upload a file directly
    public uploadFile(file: File, url: string) {
        const formData = new FormData();
        formData.append('file', file, file.name);
        return this.http.put(url, file, {
            headers: new HttpHeaders({
                'Content-Type': file.type,
                'x-amz-acl': 'private'
            })
        });
    }

  // api call to get a list of submitted writeups
  public getUploadedFiles() {
    return this.get('/writeups/files/uploaded');
  }

}
