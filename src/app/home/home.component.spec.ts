import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { SessionService } from '../session.service';
import { RouterTestingModule } from '@angular/router/testing';

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

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let service;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [
        RouterTestingModule
      ], providers: [
        {provide: SessionService, useClass: MockSessionService}
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
