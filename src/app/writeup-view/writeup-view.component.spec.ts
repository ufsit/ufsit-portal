import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteupViewComponent } from './writeup-view.component';
import { ShowdownModule } from 'ngx-showdown';
import { ExternalFileService } from '../external-file.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/observable/of';

class MockExternalFileService {
  public getWriteup(id) {
    return of({name: 'Test Writeup',
                text: '# Hello World!',
                user_name: 'Mock User'});
  }
}

describe('WriteupViewComponent', () => {
  let component: WriteupViewComponent;
  let fixture: ComponentFixture<WriteupViewComponent>;

  beforeEach(async(() => {
    const date = new Date();

    TestBed.configureTestingModule({
      declarations: [ WriteupViewComponent ],
      imports: [ ShowdownModule ],
      providers: [
        {provide: ExternalFileService, useClass: MockExternalFileService},
        {provide: ActivatedRoute, useValue: {
          snapshot: {
            params: { id: 1 }
          }
          }
        }
      ]
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

  describe('getting writeup', () => {
    it('should get and display writeup', () => {
      component.ngOnInit();

      fixture.detectChanges();
      fixture.whenStable().then(() => { 
        expect(document.getElementById('writeupTitle').innerHTML).toContain('Test Writeup');
        expect(document.getElementById('writeupSubtitle').innerHTML).toBe('by Mock User');
        expect(document.getElementById('markdownText').innerHTML).toContain('Hello World!');
        expect(document.getElementsByTagName('h1').length).toBe(1);
      });
    });
  });
});
