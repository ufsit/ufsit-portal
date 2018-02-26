import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponent } from './admin.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TimeAgoPipe } from '../time-ago.pipe';
import { RestService } from '../rest.service';
import { Observable } from 'rxjs/Observable';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { of } from 'rxjs/observable/of';
import {MockBackend, MockConnection} from '@angular/http/testing';

class MockRestService {
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
      ],
      providers: [
        {provide: RestService, useClass: MockRestService}
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
