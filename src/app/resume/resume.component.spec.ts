import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeComponent } from './resume.component';
import { ExternalFileService } from '../external-file.service';
import { RestService } from '../rest.service';
import { of } from 'rxjs/observable/of';

class MockExternalFileService {
  resumeLink = '';
  getResumeLink() {
    return of({resume: this.resumeLink});
  }
  setResumeLink(newLink) {
    this.resumeLink = newLink;
  }
}

class MockRestService {

}

describe('ResumeComponent', () => {
  let component: ResumeComponent;
  let fixture: ComponentFixture<ResumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumeComponent ],
      providers: [
        {provide: ExternalFileService, useClass: MockExternalFileService},
        {provide: RestService, useClass: MockRestService},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('user who has uploaded a resume', () => {
    it('should display the resume', () => {
      const externalFileService = TestBed.get(ExternalFileService);
      externalFileService.setResumeLink('/writeups/1');

      component.getResumeLink();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(document.getElementsByTagName('object').length).toBe(1);
        expect(document.getElementsByTagName('iframe').length).toBe(1);
        expect(document.getElementById('resumeContainer').innerHTML).not.toContain('You have not uploaded a resume yet.');
      });
    });
  });

  describe('user who has not uploaded a resume', () => {
    it('should not display a resume', () => {
      const externalFileService = TestBed.get(ExternalFileService);
      externalFileService.setResumeLink('');

      component.getResumeLink();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(document.getElementsByTagName('object').length).toBe(0);
        expect(document.getElementsByTagName('iframe').length).toBe(0);
        expect(document.getElementById('resumeContainer').innerHTML).toContain('You have not uploaded a resume yet.');
      });
    });
  });
});
