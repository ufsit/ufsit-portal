import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { RestService } from '../rest.service';
import { SortablejsModule } from 'angular-sortablejs';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css']
})
export class VotingComponent implements OnInit {
  private presidents;
  private vp;
  private treasurers;
  private secretaries;

  notifications = {
    endOfElection: false,
    alreadyVoted: false,
    notEligible: false,
    requestError: false,
    someError: true    //will be true if ANY other error is true
  };

  constructor(private session: SessionService, private restService: RestService) { }

  ngOnInit() {
    // Retrieves a list of candidates for each position from the backend
    this.restService.getCandidates().subscribe(
      res => {
        this.notifications.someError = false;
        this.presidents = res.president;
        this.vp = res.vp;
        this.treasurers = res.treasurer;
        this.secretaries = res.secretary;
      },
      err => {
        if (err.status === 405) {
          this.notifications.alreadyVoted = true;
          this.notifications.someError = true;
        } else if (err.status === 400) {
          this.notifications.endOfElection = true;
          this.notifications.someError = true;
        } else if (err.status === 403) {
          this.notifications.notEligible = true;
          this.notifications.someError = true;
        }
      }
    );
  }

  // Submits the ordered arrays to the api to store inside of the db
  public onSubmit() {
    this.restService.vote({
      presidents: this.presidents,
      vp: this.vp,
      treasurer: this.treasurers,
      secretaries: this.secretaries
    }).subscribe(            //handles what is returned from the backend
      res => {
        window.location.reload();
      },
      err => {
        if (err.status === 405) {
          this.notifications.alreadyVoted = true;
          this.notifications.someError = true;
        } else if (err.status === 400) {
          this.notifications.endOfElection = true;
          this.notifications.someError = true;
        } else if (err.status === 403) {
          this.notifications.notEligible = true;
          this.notifications.someError = true;
        } else {
        this.notifications.requestError = true;
        }
      }
    )
  }
}
