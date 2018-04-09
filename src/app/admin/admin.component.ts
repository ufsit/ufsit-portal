import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { NgForm, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})


export class AdminComponent implements OnInit {
  private results;
  private users;
  public orderForm: FormGroup;
  private cands = ['President', 'VP', 'Secretary', 'Treasurer'];

  notifications = {
    emptyField: false,
    existingPoll: false,
    electionResults: false
  }

  constructor(private sessionService: SessionService, private requests: RestService, private modalService: NgbModal,
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
        candidates: this.formBuilder.array([ this.createQuestion()])
      });

      if (!this.sessionService.getElection()) {
        this.getResults();
      }
  }

  // Returns an array of all the accounts that gets diplayed in the webpage
  public getUsers() {
    return this.users;
  }

  // Opens the popup window for the admin to use
  public open(content: any) {
    this.modalService.open(content);
  }

  //Creates FormGroups that get added to the formArray
  createQuestion(): FormGroup {
    return this.formBuilder.group({
      candidate: ['', [
        Validators.required
      ]],
      position: ['', [
        Validators.required
      ]]
    });
  }

  //Adds formgroups to the formArray
  public addItem(): void {
    const control = <FormArray>this.orderForm.controls['candidates'];
    control.push(this.createQuestion());
  }

  //Checks to make sure that there are no empty fields in the form
  private emptyForm(form: any) {
    for (let x of form.candidates) {
      if (x.candidate === '') {
        return true;
      }
      if (x.position.length === 0) {
        return true;
      }
    }
    return false;
  }

  //Sends the formgroup to be turned into a post request
  public onSubmit(formValue: any) {
    if (this.emptyForm(formValue.value)) {
      this.notifications.emptyField = true;
      return;
    }
    this.sessionService.createPoll(this.orderForm).subscribe(
      res => {
        if (res === 'Success') {
          alert('Success!  The election has been created.  Navigate to the home page to vote!');
        }
        else {
          this.notifications.existingPoll = true;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  //Deletes elments from form after clicking "x" button
  public deleteField(i) {
    const control = <FormArray>this.orderForm.controls['candidates'];
    control.removeAt(i);
  }

  // Encapsulation yo
  public getCandidates() {
    return this.cands;
  }

  // Ends the election
  public endElection() {
    this.requests.endElection().subscribe(
      res => { 
        window.location.reload();
      },
      err => {
        console.log(err);
      }
    );
  }

  // Gets the users session
  public getSession() {
    return this.sessionService;
  }

  // Gets the results of an election
  public getResults() {
    return this.requests.getElectionResults().subscribe(
      res => {
        this.notifications.electionResults = true;
        this.results = res;
        console.log(res.president);
      },
      err => {
        if (err.status === 405) {
        }
        if (err.status === 400) {
          //generic error accessing database
        }
      });
  }

  public getPresidentResults() {
    if (JSON.stringify(this.results.president) === 'null') {
      return 'Tie for First place'; }
    return JSON.stringify(this.results.president);
  }

  public getVpResults() {
    if (JSON.stringify(this.results.vp) === 'null') {
      return 'Tie for First place'; }
    return JSON.stringify(this.results.vp);
  }

  public getTreasurerResults() {
    if (JSON.stringify(this.results.treasurer) === 'null') {
      return 'Tie for First place'; }
    return JSON.stringify(this.results.treasurer);
  }

  public getSecretaryResults() {
    if (JSON.stringify(this.results.secretary) === 'null') {
      return 'Tie for First place'; }
    return JSON.stringify(this.results.secretary);
  }
}