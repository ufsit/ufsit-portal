import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap/dropdown/dropdown.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionService } from '../session.service';

class MockSessionService{
  private cachedLoggedIn = false;
  public getCachedLoggedIn() {
    return this.cachedLoggedIn;
  }
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: [
        RouterTestingModule,
        NgbModule.forRoot()
      ],
      providers: [
        {provide: SessionService, useClass: MockSessionService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navbar should start collapsed', () => {
    expect(component.getNavbarCollapsed()).toBe(true);
  });
});
