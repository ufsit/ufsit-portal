import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponent } from './admin.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TimeAgoPipe } from '../time-ago.pipe';
import { RestService } from '../rest.service';
import { Observable } from 'rxjs/Observable';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

class MockRestService {

    public customTiles() {
        return of([
            { name: 'name1', description: 'description1', link: 'https://google.com' },
            { name: 'name2', description: 'description2', link: 'https://google.com' },
        ]);
    }

    public userList(relativeUrl: string) {
        return of([
            {
                email: 'email1@ufl.edu',
                full_name: 'first last',
                grad_date: '2020 (Spring)',
                id: 1,
                mass_mail_optin: 'No',
                registration_date: '2018-01-01T00:00:00.000Z'
            },
            {
                email: 'email2@ufl.edu',
                full_name: 'second last',
                grad_date: '2020 (Spring)',
                id: 2,
                mass_mail_optin: 'No',
                registration_date: '2017-01-01T00:00:00.000Z'
            }
        ]);
    }

    public addTile(item) { return true; }

    public deleteTile(id, index) { return true; }

}

describe('AdminComponent', () => {
    let component: AdminComponent;
    let fixture: ComponentFixture<AdminComponent>;
    let restService: RestService;
    let element;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TimeAgoPipe,
                AdminComponent],
            imports: [
                RouterTestingModule,
                ReactiveFormsModule
            ],
            providers: [
                { provide: RestService, useClass: MockRestService }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement.nativeElement;
        fixture.detectChanges();
        restService = TestBed.get(RestService);
        spyOn(restService, 'addTile');
        spyOn(restService, 'deleteTile');
        spyOn(restService, 'customTiles').and.callThrough();
        spyOn(restService, 'userList').and.callThrough();
    });

    describe('should create', () => {
        it('builds component', () => {
            expect(component).toBeTruthy();
        });
        it('subscribes to data members on init', () => {
            component.ngOnInit();
            expect(restService.customTiles).toHaveBeenCalledTimes(1);
            expect(restService.userList).toHaveBeenCalledTimes(1);
        });
    });

    describe('get custom tiles', () => {
        it('gets and stores valid tile data', () => {
            restService.customTiles().subscribe((val) => {
                expect(component.getCustomTiles()).toEqual(val);
            });
        });
    });

    describe('get users', () => {
        it('gets and stores valid user data', () => {
            restService.userList('').subscribe((val) => {
                expect(component.getUsers()).toEqual(val);
            });
        });
    });

    describe('add new tile', () => {
        it('should fail when any field is null', () => {
            testAddTile(component, fixture, element, null, 'test', 'test');
            testAddTile(component, fixture, element, 'test', null, 'test');
            testAddTile(component, fixture, element, 'test', 'test', null);
            expect(restService.addTile).toHaveBeenCalledTimes(0);
        });
        it('should pass when no field is null', () => {
            testAddTile(component, fixture, element, 'test', 'test', 'test');
            expect(restService.addTile).toHaveBeenCalledTimes(1);
        });
        it('should fail when tile already exists', () => {
            testAddTile(component, fixture, element, 'test', 'test', 'test');
            testAddTile(component, fixture, element, 'test', 'test', 'test');
            expect(restService.addTile).toHaveBeenCalledTimes(1);
        });
        it('should pass for multiple unique tiles', () => {
            testAddTile(component, fixture, element, 'test1', 'test1', 'test1');
            testAddTile(component, fixture, element, 'test2', 'test2', 'test2');
            expect(restService.addTile).toHaveBeenCalledTimes(2);
        });
    });

    describe('delete exisiting tile', () => {
        it('should fail when one or more fields are empty', () => {
            component.deleteTile(1, 1);
            expect(restService.deleteTile).toHaveBeenCalledTimes(1);
        });
        it('should not delete non-present (deleted) tile', () => {
            // button not available when tiles not present
        });
    });

});

function testAddTile (component: AdminComponent,
    fixture: ComponentFixture<AdminComponent>, element,
    name: string, description: string, link: string
    ) {
    component.formData.setValue({
        name: name,
        description: description,
        link: link
    });
    component.addTile(component.formData);
}
