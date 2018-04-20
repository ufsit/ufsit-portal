import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsComponent } from './events.component';

import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarEventTitleFormatter
} from 'angular-calendar';

import { CustomEventTitleFormatter } from './custom-event-title-formatter.provider';
import { RestService } from '../rest.service';


//describe('EventsComponent', () => {
  //let component: EventsComponent;
  //let fixture: ComponentFixture<EventsComponent>;

  //beforeEach(async(() => {
    //TestBed.configureTestingModule({
      //declarations: [ EventsComponent ]
    //})
    //.compileComponents();
  //}));

  //beforeEach(() => {
    //fixture = TestBed.createComponent(EventsComponent);
    //component = fixture.componentInstance;
    //fixture.detectChanges();
  //});

  //it('should create', () => {
    //expect(component).toBeTruthy();
  //});
//});

