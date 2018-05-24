import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingComponent } from './voting.component';
import { RestService } from '../rest.service';
import { SortablejsModule } from 'angular-sortablejs';
import { of } from 'rxjs/observable/of';

class MockRestService {
  getCandidates() {
    return of({
      president: [''],
      vp: [''],
      treasurer: [''],
      secretary: ['']
    });
  }

  vote() { return true; }
}

describe('VotingComponent', () => {
  let component: VotingComponent;
  let fixture: ComponentFixture<VotingComponent>;
  let element;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotingComponent ],
      imports: [
        SortablejsModule
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
