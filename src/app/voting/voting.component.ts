import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css']
})
export class VotingComponent implements OnInit {
  public presidents;
  public vp;
  public treasurers;
  public secretaries;

  constructor(private session: SessionService, private restService: RestService) { }

  ngOnInit() {
    this.restService.getCandidates().subscribe(
      res => {
        this.presidents = res.president;
        this.vp = res.vp;
        this.treasurers = res.treasurer;
        this.secretaries = res.secretaries;
      },
      err => {
      }
    );
  }
}
