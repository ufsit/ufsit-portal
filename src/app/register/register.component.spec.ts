import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SessionService } from '../session.service';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/observable/of';

class MockSessionService {
    register(formData) {
        if (formData.email === 'repeatedemail@email.com') {
            return of(new HttpErrorResponse({ status: 409, statusText: 'email already used' }));
        } else if (formData.email === 'badrequest@email.com') {
            return of(new HttpErrorResponse({ status: 400, statusText: 'bad request' }));
        } else if (formData.email === 'genericerror@email.com') {
            return of(new HttpErrorResponse({ status: 500, statusText: 'generic error' }));
        }
        return of('Success');
    }
}

describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let element;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RegisterComponent],
            imports: [
                RouterTestingModule,
                FormsModule,
                ReactiveFormsModule
            ],
            providers: [
                { provide: SessionService, useClass: MockSessionService }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement.nativeElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('test form validation', () => {
        it('test name field', () => {
            testBadRegistration(component, fixture, element,
                '', 'mockuser@email.com', 'mockuser@ufl.edu', 'password', 'password',
                'Spring 2018', 'true');
        });

        it('test email field', () => {
            testBadRegistration(component, fixture, element,
                'Mock User', '', '', 'password', 'password',
                'Spring 2018', 'true');
            testBadRegistration(component, fixture, element,
                'Mock User', 'mockuser', '', 'password', 'password',
                'Spring 2018', 'true');
            testBadRegistration(component, fixture, element,
                'Mock User', 'mockuser@', '', 'password', 'password',
                'Spring 2018', 'true');
            testBadRegistration(component, fixture, element,
                'Mock User', 'mockuser@email', '', 'password', 'password',
                'Spring 2018', 'true');
            testBadRegistration(component, fixture, element,
                'Mock User', '@', '', 'password', 'password',
                'Spring 2018', 'true');
            testBadRegistration(component, fixture, element,
                'Mock User', '@email', '', 'password', 'password',
                'Spring 2018', 'true');
            testBadRegistration(component, fixture, element,
                'Mock User', '@email.com', '', 'password', 'password',
                'Spring 2018', 'true');
        });

        it('test ufl email field', () => {
            testBadRegistration(component, fixture, element,
                'Mock User', '', '', 'password', 'password',
                'Spring 2018', 'true');
            testBadRegistration(component, fixture, element,
                'Mock User', '', 'mockuser', 'password', 'password',
                'Spring 2018', 'true');
            testBadRegistration(component, fixture, element,
                'Mock User', '', 'mockuser@', 'password', 'password',
                'Spring 2018', 'true');
            testBadRegistration(component, fixture, element,
                'Mock User', '', 'mockuser@ufl', 'password', 'password',
                'Spring 2018', 'true');
            testBadRegistration(component, fixture, element,
                'Mock User', '', '@', 'password', 'password',
                'Spring 2018', 'true');
            testBadRegistration(component, fixture, element,
                'Mock User', '', '@ufl', 'password', 'password',
                'Spring 2018', 'true');
            testBadRegistration(component, fixture, element,
                'Mock User', '', '@ufl.com', 'password', 'password',
                'Spring 2018', 'true');

            testBadRegistration(component, fixture, element,
                'Mock User', '', 'mockuser@email.com', 'password', 'password',
                'Spring 2018', 'true');
            /* testBadRegistration(component, fixture, element,
                'Mock User', '', 'mockuser@ufl.com', 'password', 'password',
                'Spring 2018', 'true');
            testBadRegistration(component, fixture, element,
                'Mock User', 'mockuser@email.com', 'mockuser@ufl.com', 'password', 'password',
                'Spring 2018', 'true');
            testBadRegistration(component, fixture, element,
                'Mock User', 'left_blank@ufl.edu', 'mockuser@ufl.edu', 'password', 'password',
                'Spring 2018', 'true');
            testBadRegistration(component, fixture, element,
                'Mock User', 'mockuser@email.com', 'left_blank@ufl.edu', 'password', 'password',
                'Spring 2018', 'true'); */

        });

        it('test password fields', () => {
            testBadRegistration(component, fixture, element,
                'Mock User', 'mockuser@email.com', '', '', '',
                'Spring 2018', 'true');
            testBadRegistration(component, fixture, element,
                'Mock User', 'mockuser@email.com', '', 'password', '',
                'Spring 2018', 'true');
            testBadRegistration(component, fixture, element,
                'Mock User', 'mockuser@email.com', '', '', 'password',
                'Spring 2018', 'true');
            /* testBadRegistration(component, fixture, element,
                'Mock User', 'mockuser@email.com', '', 'asdf', 'asdf',
                'Spring 2018', 'true');
            testBadRegistration(component, fixture, element,
                'Mock User', 'mockuser@email.com', '', 'a', 'a',
                'Spring 2018', 'true'); */
        });

        it('test graduation date field', () => {
            testBadRegistration(component, fixture, element,
                'Mock User', 'mockuser@email.com', '', 'password', 'password',
                '', 'true');
            testBadRegistration(component, fixture, element,
                'Mock User', '', 'mockuser@ufl.edu', 'password', 'password',
                '', 'true');
        });
    });

    it('should display email conflict error', () => {
        component.formData.setValue({
            name: 'Mock User',
            email: 'repeatedemail@email.com',
            ufl_email: '',
            password: 'password',
            confirm_password: 'password',
            grad_date: 'Spring 2018',
            subscribe: 'true'
        });

        component.checkWaiver();
        fixture.detectChanges();
        fixture.whenStable().then(() => {

            component.submitRegistration();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(component.notifications.invalid_credentials).toBe(false);
                expect(component.notifications.bad_request).toBe(false);
                expect(component.notifications.generic_error).toBe(false);
                expect(component.notifications.email_conflict).toBe(true);
                expect(element.querySelector('#invalidCredentialsAlert')).not.toBeTruthy();
                expect(element.querySelector('#badRequestAlert')).not.toBeTruthy();
                expect(element.querySelector('#genericErrorAlert')).not.toBeTruthy();
                expect(element.querySelector('#emailConflictAlert')).toBeTruthy();
            });

        });
    });

    it('should display bad request error', () => {
        component.formData.setValue({
            name: 'Mock User',
            email: 'badrequest@email.com',
            ufl_email: '',
            password: 'password',
            confirm_password: 'password',
            grad_date: 'Spring 2018',
            subscribe: 'true'
        });

        component.checkWaiver();
        fixture.detectChanges();
        fixture.whenStable().then(() => {

            component.submitRegistration();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(component.notifications.invalid_credentials).toBe(false);
                expect(component.notifications.bad_request).toBe(true);
                expect(component.notifications.generic_error).toBe(false);
                expect(component.notifications.email_conflict).toBe(false);
                expect(element.querySelector('#invalidCredentialsAlert')).not.toBeTruthy();
                expect(element.querySelector('#badRequestAlert')).toBeTruthy();
                expect(element.querySelector('#genericErrorAlert')).not.toBeTruthy();
                expect(element.querySelector('#emailConflictAlert')).not.toBeTruthy();
            });

        });
    });

    it('should display generic error error', () => {
        component.formData.setValue({
            name: 'Mock User',
            email: 'genericerror@email.com',
            ufl_email: '',
            password: 'password',
            confirm_password: 'password',
            grad_date: 'Spring 2018',
            subscribe: 'true'
        });

        component.checkWaiver();
        fixture.detectChanges();
        fixture.whenStable().then(() => {

            component.submitRegistration();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(component.notifications.invalid_credentials).toBe(false);
                expect(component.notifications.bad_request).toBe(false);
                expect(component.notifications.generic_error).toBe(true);
                expect(component.notifications.email_conflict).toBe(false);
                expect(element.querySelector('#invalidCredentialsAlert')).not.toBeTruthy();
                expect(element.querySelector('#badRequestAlert')).not.toBeTruthy();
                expect(element.querySelector('#genericErrorAlert')).toBeTruthy();
                expect(element.querySelector('#emailConflictAlert')).not.toBeTruthy();
            });
        });
    });
});

function testBadRegistration(component: RegisterComponent,
    fixture: ComponentFixture<RegisterComponent>,
    element, name: string, email: string, ufl_email: string,
    password: string, confirm_password: string,
    grad_date: string, subscribe: string) {
    component.notifications.invalid_credentials = false;
    component.formData.setValue({
        name: name,
        email: email,
        ufl_email: ufl_email,
        password: password,
        confirm_password: confirm_password,
        grad_date: grad_date,
        subscribe: subscribe
    });
    component.submitRegistration();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
        expect(component.notifications.invalid_credentials).toBe(true);
        expect(component.notifications.bad_request).toBe(false);
        expect(component.notifications.generic_error).toBe(false);
        expect(component.notifications.email_conflict).toBe(false);
        expect(element.querySelector('#invalidCredentialsAlert')).toBeTruthy();
        expect(element.querySelector('#badRequestAlert')).not.toBeTruthy();
        expect(element.querySelector('#genericErrorAlert')).not.toBeTruthy();
        expect(element.querySelector('#emailConflictAlert')).not.toBeTruthy();
    });
}
