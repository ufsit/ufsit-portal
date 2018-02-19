import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileComponent } from './edit_profile.component';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SessionService } from '../session.service';
import { RegisterComponent } from '../register/register.component';
import { RestService } from '../rest.service';
import { ActivatedRoute } from '@angular/router';

class MockSessionService {
  public profile;
  update_profile(formData) {
    console.log(formData.value.email);
    if (formData.value.email === 'badrequest@email.com') {
      return of(new HttpErrorResponse({status: 409, statusText: 'bad request'}));
    } else if (formData.value.email === 'genericerror@email.com') {
      return of(new HttpErrorResponse({status: 500, statusText: 'generic error'}));
    } else if (formData.value.email === 'invalid@email.com') {
      return of(new HttpErrorResponse({status: 400, statusText: 'invalid credentials error'}));
    }
    return of('Success');
  }
  setProfile(newProfile) {
    this.profile = newProfile;
  }
  getProfile() {
    return this.profile;
  }
}

describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;
  let element;

  beforeEach(async(() => {
    let date = new Date();
    TestBed.configureTestingModule({
      declarations: [ EditProfileComponent ],
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        {provide: SessionService, useClass: MockSessionService},
        {provide: ActivatedRoute, useValue: {
          snapshot: {
            params: {id: undefined },
            data: {
              profile: {
                full_name: 'Cheyenne Doe',
                email: 'cd@ufl.edu',
                old_password: 'password',
                new_password: 'new',
                confirm_password: 'new',
                mass_mail_optin: '0',
                registration_date: date
              }
            }
          }
        }}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('test form validation', () => {

    it('test name field', () => {
      testBadUpdate(component, fixture, element, '', 'cd@ufl.edu',
                    'password', 'password1', 'password1', 'Spring 2018', 'true');
    });

    it('test password field', () => {
      testBadUpdate(component, fixture, element, 'Cheyenne Doe', 'cd@ufl.edu',
                   '', 'password', 'password', 'Spring 2018', 'true');
      testBadUpdate(component, fixture, element, 'Cheyenne Doe', 'invalid@email.com',
                   'abc', 'password', 'password', 'Spring 2018', 'true');
      testBadUpdate(component, fixture, element, 'Cheyenne Doe', 'cd@ufl.edu',
                   'password', '', 'new', 'Spring 2018', 'true');
      testBadUpdate(component, fixture, element, 'Cheyenne Doe', 'cd@ufl.edu',
                    'password', 'new', '', 'Spring 2018', 'true');
    });

    it('test graduation date field', () => {
      testBadUpdate(component, fixture, element, 'Cheyenne Doe', 
                     'mockuser@email.com', 'password', 'newpassword', 'newpassword',
                    '', 'true');
    });
  });

  it('should display bad request error', () => {
    component.formData.setValue({
      name: 'Mock User',
      email: 'badrequest@email.com',
      old_password: 'password',
      new_password: 'new',
      confirm_password: 'new',
      grad_year: 'Spring 2018',
      subscribe: 'true'
    });

    component.update_profile();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.notifications.invalid_credentials).toBe(false);
      expect(component.notifications.bad_request).toBe(true);
      expect(component.notifications.generic_error).toBe(false);
      expect(element.querySelector('#invalidCredentialsAlert')).not.toBeTruthy();
      expect(element.querySelector('#badRequestAlert')).toBeTruthy();
      expect(element.querySelector('#genericErrorAlert')).not.toBeTruthy();
    });
  });

  it('should display generic error error', () => {
    component.formData.setValue({
      name: 'Mock User',
      email: 'genericerror@email.com',
      old_password: 'password',
      new_password: 'new',
      confirm_password: 'new',
      grad_year: 'Spring 2018',
      subscribe: 'true'
    });
    component.update_profile();
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


function testBadUpdate(component: EditProfileComponent, 
                      fixture: ComponentFixture<EditProfileComponent>, element, name: string, email: string, old_password: string,
                      new_password: string, confirm_password: string, grad_date: string, subscribe: string) {
  component.notifications.invalid_credentials = false;
  component.formData.setValue({
    name: name,
    email: email,
    old_password: old_password,
    new_password: new_password,
    confirm_password: confirm_password,
    grad_year: grad_date,
    subscribe: subscribe
  });
  component.update_profile();
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
