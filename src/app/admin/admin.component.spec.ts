import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponent } from './admin.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TimeAgoPipe } from '../time-ago.pipe';
import { RestService } from '../rest.service';
import { Observable } from 'rxjs/Observable';
import { HttpResponse, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import {MockBackend, MockConnection} from '@angular/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SessionService } from '../session.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

class MockRestService {
  public user_list(x) {
    return of([{id: 1, email: "jd@ufl.edu", full_name: "John Doe", mass_mail_optin: "Yes", grad_date: "2018 (Spring)", 
    registration_date: "2018-02-10T00:39:24.000Z"}]);
  }
}

class MockSessionService {
  
}

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let element;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        TimeAgoPipe,
        AdminComponent ],
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule.forRoot()   ],
      providers: [
        {provide: RestService, useClass: MockRestService},
        {provide: SessionService, useClass: MockSessionService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
