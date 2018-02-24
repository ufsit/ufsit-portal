import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})


export class AdminComponent implements OnInit {
  private users;

  constructor(private requests: RestService, private modalService: NgbModal) { }

  ngOnInit() {
    // Uses the RestService to make an http request for a list of users
    this.requests.user_list('/list_users').subscribe(
      // This portion of code is run if the list is properly returned
      res => {
        // TODO: FIX JANKINESS
        let i = 0;
        while (res[i] != undefined) {
          let user = res[i];
          user['mass_mail_optin'] = (user['mass_mail_optin'] === 1) ? 'Yes' : 'No';
          ++i;
        }
        this.users = res;
      },
      error => {    // This portion of code is run when there was an error retrieving the user list
        console.log(error);
      });
  }

  public getUsers() {
    return this.users;
  }

  public open(content: any) {
    this.modalService.open(content);
  }

}
