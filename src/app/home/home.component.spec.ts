import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { SessionService } from '../session.service';
import { RouterTestingModule } from '@angular/router/testing';
import { query } from '@angular/core/src/render3/instructions';
import { RestService } from '../rest.service';
import { of } from 'rxjs/observable/of';

class MockSessionService {
  private profile;

  constructor() {
    this.profile = {
      full_name: 'Mock User'
    };
  }

  public getProfile() {
    return this.profile;
  }

  public setProfile(data) {
    this.profile = data;
  }

  public getElection() {
    return true;
  }
}

class MockRestService {
  public customTiles() {
    return of(JSON.parse('[{}, {}]'));
  }
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  // let service;
  let element;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [
        RouterTestingModule
      ], providers: [
        {provide: SessionService, useClass: MockSessionService},
        {provide: RestService, useClass: MockRestService}
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('the user\'s name is shown at the top of the page', () => {
    const sessionService = TestBed.get(SessionService);
    console.log(element.querySelector('#userName'));
    expect(element.querySelector('#userName').innerHTML)
      .toBe(sessionService.getProfile().full_name);
  });

  it('the user\'s name should be responsive to a change in value', () => {
    const sessionService = TestBed.get(SessionService);
    sessionService.setProfile({ full_name: 'Another User' });
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(element.querySelector('#userName').innerHTML)
      .toBe(sessionService.getProfile().full_name);
      expect(element.querySelector('#userName').innerHTML)
      .toBe('Another User');
    });
  });
});
