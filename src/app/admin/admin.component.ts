import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {

    private users;

    constructor(private requests: RestService) { }

    ngOnInit() {
        // Uses the RestService to make an http request for a list of users
        this.requests.userList('/list_users').subscribe(
            // This portion of code is run if the list is properly returned
            res => {
                for (let i = 0; res[i] !== undefined; i++) {
                    const user = res[i];
                    user['mass_mail_optin'] = (user['mass_mail_optin'] === 1) ? 'Yes' : 'No';
                }
                this.users = res;
            },
            error => { console.log(error); }
        );
    }

    public getUsers() {
        return this.users;
    }

}
