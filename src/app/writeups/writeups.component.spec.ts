import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteupsComponent } from './writeups.component';

describe('WriteupsComponent', () => {
  let component: WriteupsComponent;
  let fixture: ComponentFixture<WriteupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
