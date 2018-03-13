import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, FormsModule } from '@angular/forms';
import { RestService } from '../rest.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {

    formData: FormGroup;
    private users;
    private customTiles;

    constructor(
        private requests: RestService
    ) { }

    ngOnInit() {

        const fb: FormBuilder = new FormBuilder();
        this.formData = fb.group({ name: [], description: [], link: [] });

        this.requests.customTiles().subscribe(
            success => { this.customTiles = success; },
            failure => { console.log(failure); }
        );

        this.requests.userList('/list_users').subscribe(
            success => {
                for (let i = 0; success[i] !== undefined; i++) {
                    const user = success[i];
                    user['mass_mail_optin'] = (user['mass_mail_optin'] === 1) ? 'Yes' : 'No';
                }
                this.users = success;
            },
            failure => { console.log(failure); }
        );

    }

    private isNotDuplicate(item) {
        let val = true;
        this.customTiles.forEach(function (ct) {
            if (ct.name === item.name
                && ct.description === item.description
                && ct.link === item.link) {
                val = false;
            }
        });
        return val;
    }

    public getUsers() {
        return this.users;
    }

    public getCustomTiles() {
        return this.customTiles;
    }

    public addTile(formData: FormGroup) {
        const item = formData.value;
        if (item.name !== null && item.description !== null && item.link !== null) {
            if (this.isNotDuplicate(item)) {
                this.requests.addTile(item);
                window.open(item.link, '_blank');
                this.formData.reset();
                this.requests.customTiles().subscribe(
                    success => { this.customTiles = success; },
                    failure => { console.log(failure); }
                );
            } else {
                // duplicate to current tile
            }
        }
    }

    public deleteTile(id) {
        this.requests.deleteTile(id);
        this.requests.customTiles().subscribe(
            success => { this.customTiles = success; },
            failure => { console.log(failure); }
        );
    }

}
