import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})


export class AdminComponent implements OnInit {

  constructor(private requests: RestService) { }

  ngOnInit() {
    //Uses the RestService to make an http request for a list of users
    this.requests.user_list("/list_users").subscribe(
      //This portion of code is run if the list is properly returned
      res => {
        let user: {}[];
          res['list_users'].forEach(
            user => {
              if (user['mass_mail_optin'] == 1) {
                user['mass_mail_optin'] = "Yes"                
              }
              else
                user['mass_mail_optin'] = "No"
            }
          );
      },
      error => {    //This portion of code is run when there was an error retrieving the user list

      });
  }

}
