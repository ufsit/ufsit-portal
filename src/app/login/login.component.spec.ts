import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionService } from '../session.service';
import { FormsModule, NgForm, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs/observable/of';

class MockSessionService {
  private profile;

  constructor() {
    this.profile = {
      full_name: 'Mock User'
    };
  }

  public login(formData) {
    if (formData.email === 'mockuser@email.com'
      && formData.password === 'wrong_password') {
      return of(new HttpErrorResponse({status: 401, statusText: 'invalid credentials'}));
    } else if (formData.email === 'wrongemail@email.com'
      && formData.password === 'password') {
      return of(new HttpErrorResponse({status: 401, statusText: 'invalid credentials'}));
    } else if (formData.email === 'mockuser@email.com'
      && formData.password === 'password') {
        return of('Successfully Authenticated');
    } else if (formData.email === 'mockuser@email.com'
      && formData.password === 'genericerrortest') {
        return of(new HttpErrorResponse({status: 500, statusText: 'generic error'}));
    }
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let element;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        {provide: SessionService, useClass: MockSessionService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display invalid credentials when email or password are invalid', () => {
    badLoginTest(component, fixture, element, '', '');
    badLoginTest(component, fixture, element, 'mockuser', 'password');
    badLoginTest(component, fixture, element, 'mockuser@', 'password');
    badLoginTest(component, fixture, element, '@email.com', 'password');
    badLoginTest(component, fixture, element, 'mockuser@email', 'password');
    badLoginTest(component, fixture, element, '@email', 'password');
  });

  it('should display invalid credentials when a 401 status code is returned', () => {
    component.formData.setValue({
      email: 'mockuser@email.com',
      password: 'wrong_password'
    });
    component.submitLogin();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.notifications.invalid_credentials).toBe(true);
      expect(component.notifications.bad_request).toBe(false);
      expect(component.notifications.generic_error).toBe(false);
      expect(element.querySelector('#invalidCredentialsAlert')).toBeTruthy();
      expect(element.querySelector('#badRequestAlert')).not.toBeTruthy();
      expect(element.querySelector('#genericErrorAlert')).not.toBeTruthy();
    });

    component.notifications.invalid_credentials = false;
    component.formData.setValue({
      email: 'wrongemail@email.com',
      password: 'password'
    });
    component.submitLogin();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.notifications.invalid_credentials).toBe(true);
      expect(component.notifications.bad_request).toBe(false);
      expect(component.notifications.generic_error).toBe(false);
      expect(element.querySelector('#invalidCredentialsAlert')).toBeTruthy();
      expect(element.querySelector('#badRequestAlert')).not.toBeTruthy();
      expect(element.querySelector('#genericErrorAlert')).not.toBeTruthy();
    });
  });

  it('should log the user in when his/her credentials are correct', () => {
    component.formData.setValue({
      email: 'mockuser@email.com',
      password: 'password'
    });
    component.submitLogin();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.notifications.invalid_credentials).toBe(false);
      expect(component.notifications.bad_request).toBe(false);
      expect(component.notifications.generic_error).toBe(false);
      expect(element.querySelector('#invalidCredentialsAlert')).not.toBeTruthy();
      expect(element.querySelector('#badRequestAlert')).not.toBeTruthy();
      expect(element.querySelector('#genericErrorAlert')).not.toBeTruthy();
    });
  });

  it('should display a generic error when appropriate', () => {
    component.formData.setValue({
      email: 'mockuser@email.com',
      password: 'genericerrortest'
    });
    component.submitLogin();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.notifications.invalid_credentials).toBe(false);
      expect(component.notifications.bad_request).toBe(false);
      expect(component.notifications.generic_error).toBe(true);
      expect(element.querySelector('#invalidCredentialsAlert')).not.toBeTruthy();
      expect(element.querySelector('#badRequestAlert')).not.toBeTruthy();
      expect(element.querySelector('#genericErrorAlert')).toBeTruthy();
    });
  });
});

function badLoginTest(component: LoginComponent,
                      fixture: ComponentFixture<LoginComponent>,
                      element,
                      email: string,
                      password: string) {
  component.formData.setValue({
    email: email,
    password: password
  });
  component.notifications.invalid_credentials = false;
  component.submitLogin();
  fixture.detectChanges();
  fixture.whenStable().then(() => {
    expect(component.notifications.invalid_credentials).toBe(true);
    expect(component.notifications.bad_request).toBe(false);
    expect(component.notifications.generic_error).toBe(false);
    expect(element.querySelector('#invalidCredentialsAlert')).toBeTruthy();
    expect(element.querySelector('#badRequestAlert')).not.toBeTruthy();
    expect(element.querySelector('#genericErrorAlert')).not.toBeTruthy();
  });
}
