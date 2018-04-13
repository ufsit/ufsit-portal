import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CTFBoardComponent } from './ctf-board.component';
import { RouterTestingModule } from '@angular/router/testing';
import { LimitToPipe } from '../limit-to.pipe';
import { RestService } from '../rest.service';
import { Observable } from 'rxjs/Observable';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgbModule, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SessionService } from '../session.service';
import { NgForm } from '@angular/forms';

class MockRestService {

    public getAllWriteups() { return of([]); }

    public customCTFClick(id: number) { return id; }

    public ctfShowHide(id: number, status) { return id; }

    public ctfSetDifficulty(id: number, form, ind) { return id; }

    public ctfDelete() { return null; }

}

class MockSessionService {

    public getAdmin() { return true; }

}

describe('CTFBoardComponent', () => {
    let component: CTFBoardComponent;
    let fixture: ComponentFixture<CTFBoardComponent>;
    let restService: RestService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                LimitToPipe,
                CTFBoardComponent
            ],
            imports: [
                RouterTestingModule,
                ReactiveFormsModule,
                FormsModule,
                NgbModule.forRoot()
            ],
            providers: [
                {
                    provide: ActivatedRoute, useValue: {
                        snapshot: {
                            params: { id: undefined },
                            data:
                                {
                                    profile: {
                                        full_name: 'Mock User',
                                        email: 'mockuser@email.com',
                                        grad_date: 'Spring 2018',
                                        mass_mail_optin: '0',
                                        registration_date: Date
                                    }
                                }
                        }
                    }
                },
                {
                    provide: RestService, useClass: MockRestService
                },
                {
                    provide: SessionService, useClass: MockSessionService
                },
                {
                    provide: NgbModal, useClass: NgbModal
                }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CTFBoardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        restService = TestBed.get(RestService);
        spyOn(restService, 'getAllWriteups').and.callThrough();
        spyOn(restService, 'customCTFClick').and.callThrough();
        spyOn(restService, 'ctfShowHide').and.callThrough();
    });

    describe('should create', () => {
        it('builds component', () => {
            expect(component).toBeTruthy();
        });
        it('subscribes to resources on init', () => {
            component.ngOnInit();
            expect(restService.getAllWriteups).toHaveBeenCalledTimes(1);
        });
    });

});
