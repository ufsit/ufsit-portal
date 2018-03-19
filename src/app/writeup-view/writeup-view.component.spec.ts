import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteupViewComponent } from './writeup-view.component';

describe('WriteupViewComponent', () => {
  let component: WriteupViewComponent;
  let fixture: ComponentFixture<WriteupViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteupViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
