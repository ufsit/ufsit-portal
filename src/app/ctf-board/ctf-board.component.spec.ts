import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CtfBoardComponent } from './ctf-board.component';

describe('CtfBoardComponent', () => {
  let component: CtfBoardComponent;
  let fixture: ComponentFixture<CtfBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CtfBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CtfBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
