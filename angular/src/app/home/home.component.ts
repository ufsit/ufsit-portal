import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private profile;

  // import the ActivatedRoute so we can get the result of what was resolved
  // before navigating here
  constructor(private route: ActivatedRoute) { }

  // set the profile to the resolved profile data
  ngOnInit() {
    this.profile = this.route.snapshot.data.profile;
  }

  //public accessor for profile
  public getProfile(){
    return this.profile;
  }

}
