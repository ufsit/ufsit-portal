import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { NgForm, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})


export class AdminComponent implements OnInit {
  private users;
  public orderForm: FormGroup;

  notifications = {
    emptyField: false
  }

  constructor(private requests: RestService, private modalService: NgbModal,
              private formBuilder: FormBuilder) { }

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
    
      this.orderForm = this.formBuilder.group({
        position: ['', [
          Validators.required
        ]],
        candidates: this.formBuilder.array([ this.createQuestion()])
      });
  }

  // Returns an array of all the accounts that gets diplayed in the webpage
  public getUsers() {
    return this.users;
  }

  // Opens the popup window for the admin to use
  public open(content: any) {
    this.modalService.open(content);
  }

  createQuestion(): FormGroup {
    return this.formBuilder.group({
      candidate: ['', [
        Validators.required
      ]]
    });
  }

  public addItem(): void {
    const control = <FormArray>this.orderForm.controls['candidates'];
    control.push(this.createQuestion());
  }

  emptyForm(form: any) {
    if (form.position === '') {
      return true;
    }
    for (let x of form.candidates) {
      if (x.candidate === '') {
        return true;
      }
    }
    return false;
  }

  public onSubmit(formValue: any) {
    if (this.emptyForm(formValue.value)) {
      this.notifications.emptyField = true;
    }
  }
}