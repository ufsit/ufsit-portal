import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CTFBoardComponent } from './ctf-board.component';
import { RouterTestingModule } from '@angular/router/testing';
import { LimitToPipe } from '../limit-to.pipe';
import { RestService } from '../rest.service';
import { Observable } from 'rxjs/Observable';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ActivatedRoute } from '@angular/router';

class MockRestService {
    public temp() {
        return true;
    }
}

describe('CTFBoardComponent', () => {
    let component: CTFBoardComponent;
    let fixture: ComponentFixture<CTFBoardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                LimitToPipe,
                CTFBoardComponent
            ],
            imports: [RouterTestingModule],
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
                }
            ]
        }).compileComponents();
}));

beforeEach(() => {
    fixture = TestBed.createComponent(CTFBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
});

it('should create', () => {
    expect(component).toBeTruthy();
});
});
