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
    public userList(variable: string): Observable<Response> {
        return this.get('/admin' + variable);
    }

    // api call to log out a user
    public logout() {
        return this.post('/session/logout');
    }

    // api call to register a user, given his or her name , email, password,
    // graduation year, and subscribe preferences
    public register(formData: {}) {
        return this.post('/user/register', formData, { responseType: 'text' });
    }

    // api call to update a user's profile information
    public update(formData: FormGroup, url: string) {
        return this.post('/user/profile' + url, formData.value, { responseType: 'text' });
    }

    // api call by admin only to create a poll
    public createPoll(formData: FormGroup) {
        return this.post('/admin/poll', formData.value, { responseType: 'text' });
    }

    // api call to sign a user into an event
    public signin(email: string) {
        return this.post('/event/sign_in', { email: email });
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

    // api call to get a list of the user's submitted writeups
    public getSubmittedWriteups() {
        return this.get('/writeups/submitted');
    }

    // api call to get a list of all submitted writeups
    public getAllWriteups() {
        return this.get('/writeups/all');
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

    // api call to get the user's resume link
    public getResumeLink() {
        return this.get('/resume/link');
    }

    // api call to get a signed url for a file
    public signResume(fileName: string, fileType: string) {
        return this.get('/upload/resume', new HttpParams()
            .set('file-name', fileName)
            .set('file-type', fileType));
    }

    // api call to get a list of the candidates in an election
    public getCandidates() {
        return this.get('/voting/get_candidates');
    }

    // api call to store a person's vote
    public vote(ballot) {
        return this.post('/voting/send_vote', ballot);
    }

    // api call to delete the candidates in an election, thus ending the election
    public endElection() {
        return this.post('/voting/end_election');
    }

    // api call to get the results of an election
    public getElectionResults() {
        return this.get('/voting/get_election_results');
    }

    public deleteElectionResults() {
        return this.post('/voting/delete_results');
    }
}
