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
  //private arr = [];
  public orderForm: FormGroup;

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
        pollTitle: '',
        items: this.formBuilder.array([ this.createQuestion()])
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
      question: '',
      answers: ['']
    });
  }

  createAnswers(): FormGroup {
    return this.formBuilder.group({
      answer: '',
    });
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  public addItem(): void {
    this.items.push(this.createQuestion());
  }
  // public addAnswer(thing: FormBuilder.arr): void {
  //   thing.push(this.createAnswers());
  // }

  public OnSubmit(formValue: any) {
    console.log(formValue);
  }
}
