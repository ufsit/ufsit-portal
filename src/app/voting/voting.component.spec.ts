import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingComponent } from './voting.component';
import { RestService } from '../rest.service';
import { SortablejsModule } from 'angular-sortablejs';
import { RouterTestingModule } from "@angular/router/testing";

class MockRestService {
  getCandidates() { return true; }

  vote() { return true; }
}

describe('VotingComponent', () => {
  let component: VotingComponent;
  let fixture: ComponentFixture<VotingComponent>;
  let restService: RestService;
  let element;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotingComponent ],
      imports: [
        SortablejsModule,
        RouterTestingModule
      ],
      providers: [
        {provide: RestService, useClass: MockRestService},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
