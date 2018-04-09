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

    public getAllWriteups() {
        return of([
            { name: 'name1', description: 'description1', link: 'https://google.com' },
            { name: 'name2', description: 'description2', link: 'https://google.com' },
        ]);
    }

    public customCTFClick(id: number) { return id; }

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
        restService = TestBed.get(RestService);
        spyOn(restService, 'getAllWriteups').and.callThrough();
        spyOn(restService, 'customCTFClick').and.callThrough();
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
