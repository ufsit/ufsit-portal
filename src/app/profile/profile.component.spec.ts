import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionService } from '../session.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { TimeAgoPipe } from '../time-ago.pipe';

class MockSessionService {
  private profile;

  constructor() {
    this.profile = {
      full_name: 'Mock User'
    };
  }

  public getProfile() {
    return this.profile;
  }

  public setProfile(data) {
    this.profile = data;
  }

}

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileComponent, TimeAgoPipe ],
      imports: [ RouterTestingModule ],
      providers: [
        {provide: SessionService, useClass: MockSessionService},
        {provide: ActivatedRoute, useValue: {
          snapshot: {
            params: { id: undefined },
            data:
              {profile: {
                full_name: 'Mock User'
              }}
          }
        }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
