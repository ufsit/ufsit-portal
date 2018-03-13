import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteupsComponent } from './writeups.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ExternalFileService } from '../external-file.service';
import { RestService } from '../rest.service';
import { ShowdownModule } from 'ngx-showdown';
import { HttpResponse } from 'selenium-webdriver/http';
import { of } from 'rxjs/observable/of';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

class MockExternalFileService {
  public uploadWriteup(data: string, ctfName: string, challengeName: string) {
    if (data === 'success') {
      return of(null);
    }
  }

  public getWriteup(ctfName: string, challengeName: string, fileName: string) {
    return of({
      ctfName: 'CTF 1',
      challengeName: 'Challenge A',
      markdownInput: 'test'
    });
  }

  public signFile(fileName: string, fileType: string) {
    return of({
      url: 'http://localhost/api/upload/file/file.jpg',
      key: 'writeups/files/file.jpg'
    });
  }

  public uploadFile(file: File, url: string) {
    return of(null);
  }
}

class MockRestService {
  public getSubmittedWriteups() {
    return of([
      {key: 'writeups/CTF 1/Challenge A/1.md'},
      {key: 'writeups/CTF 1/Challenge B/3.md'}
    ]);
  }
}

describe('WriteupsComponent', () => {
  let component: WriteupsComponent;
  let fixture: ComponentFixture<WriteupsComponent>;
  let element;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteupsComponent ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        ShowdownModule
      ],
      providers: [
        {provide: ExternalFileService, useClass: MockExternalFileService},
        {provide: RestService, useClass: MockRestService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteupsComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('test form', () => {
    it('should fail when one or more fields are empty', () => {
      testInvalidForm(component, fixture, element, '', '', '');
      testInvalidForm(component, fixture, element, '', '', 'test');
      testInvalidForm(component, fixture, element, '', 'CTF1', '');
      testInvalidForm(component, fixture, element, '', 'CTF1', 'test');
      testInvalidForm(component, fixture, element, 'ChallengeA', '', '');
      testInvalidForm(component, fixture, element, 'ChallengeA', '', 'test');
      testInvalidForm(component, fixture, element, 'ChallengeA', 'CTF1', '');
    });
  });

  describe('submitting a writeup', () => {
    it('should notify the user on success', () => {
      component.formData.setValue({
        challengeName: 'Challenge A',
        ctfName: 'CTF 1',
        markdownInput: 'success'
      });
      component.submitWriteup();

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(component.notifications.writeup_submit_successful).toBe(true);
        expect(component.notifications.writeup_submit_error).toBe(false);
        expect(component.notifications.form_invalid).toBe(false);
        expect(component.notifications.file_upload_successful).toBe(false);
        expect(component.notifications.file_upload_error).toBe(false);
        expect(component.notifications.writeup_list_error).toBe(false);
        expect(component.notifications.writeup_load_error).toBe(false);
        expect(component.notifications.writeup_load_successful).toBe(false);
        expect(component.notifications.generic_error).toBe(false);
        expect(component.notifications.bad_request).toBe(false);

        expect(element.querySelector('#writeupSubmitSuccessfulAlert')).toBeTruthy();
        expect(element.querySelector('#writeupSubmitErrorAlert')).not.toBeTruthy();
        expect(element.querySelector('#formInvalidAlert')).not.toBeTruthy();
        expect(element.querySelector('#fileUploadSuccessfulAlert')).not.toBeTruthy();
        expect(element.querySelector('#fileUploadErrorAlert')).not.toBeTruthy();
        expect(element.querySelector('#writeupListErrorAlert')).not.toBeTruthy();
        expect(element.querySelector('#writeupLoadErrorAlert')).not.toBeTruthy();
        expect(element.querySelector('#writeupLoadSuccessfulAlert')).not.toBeTruthy();
        expect(element.querySelector('#genericErrorAlert')).not.toBeTruthy();
        expect(element.querySelector('#badRequestAlert')).not.toBeTruthy();
      });
    });
  });

  describe('getting list of submitted writeups', () => {
    it('should display all submitted writeups', () => {
      component.getSubmittedWriteups();

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        let rows = fixture.nativeElement.querySelectorAll('tbody tr');
        expect(rows.length).toBe(2);
        expect(rows[0].html().indexOf('CTF 1')).not.toBe(-1);
        expect(rows[0].html().indexOf('Challenge A')).not.toBe(-1);
        expect(rows[0].html().indexOf('1.md')).not.toBe(-1);
        expect(rows[0].html().indexOf('Challenge B')).toBe(-1);
        expect(rows[0].html().indexOf('3.md')).not.toBe(-1);

        expect(rows[1].html().indexOf('CTF 1')).not.toBe(-1);
        expect(rows[1].html().indexOf('Challenge B')).not.toBe(-1);
        expect(rows[1].html().indexOf('3.md')).not.toBe(-1);
        expect(rows[1].html().indexOf('Challenge A')).toBe(-1);
        expect(rows[1].html().indexOf('1.md')).not.toBe(-1);
      });
    });
  });

  describe('loading writeup', () => {
    it('should load submitted writeups', () => {
      component.load('CTF 1', 'Challenge A', '3.md');

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(element.querySelector('showdown').html().indexOf('test')).not.toBe(-1);

        expect(component.notifications.writeup_submit_successful).toBe(false);
        expect(component.notifications.writeup_submit_error).toBe(false);
        expect(component.notifications.form_invalid).toBe(false);
        expect(component.notifications.file_upload_successful).toBe(false);
        expect(component.notifications.file_upload_error).toBe(false);
        expect(component.notifications.writeup_list_error).toBe(false);
        expect(component.notifications.writeup_load_error).toBe(false);
        expect(component.notifications.writeup_load_successful).toBe(true);
        expect(component.notifications.generic_error).toBe(false);
        expect(component.notifications.bad_request).toBe(false);

        expect(element.querySelector('#writeupSubmitSuccessfulAlert')).not.toBeTruthy();
        expect(element.querySelector('#writeupSubmitErrorAlert')).not.toBeTruthy();
        expect(element.querySelector('#formInvalidAlert')).not.toBeTruthy();
        expect(element.querySelector('#fileUploadSuccessfulAlert')).not.toBeTruthy();
        expect(element.querySelector('#fileUploadErrorAlert')).not.toBeTruthy();
        expect(element.querySelector('#writeupListErrorAlert')).not.toBeTruthy();
        expect(element.querySelector('#writeupLoadErrorAlert')).not.toBeTruthy();
        expect(element.querySelector('#writeupLoadSuccessfulAlert')).toBeTruthy();
        expect(element.querySelector('#genericErrorAlert')).not.toBeTruthy();
        expect(element.querySelector('#badRequestAlert')).not.toBeTruthy();
      });
    });
  });

  describe('uploading file', () => {
    it('should upload file', () => {
      component.file = new File(['data'], 'file.jpg');
      component.uploadFile();

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(element.querySelector('#fileBank').html()
          .indexOf('writeups/files/file.jpg')).not.toBe(-1);

        expect(component.notifications.writeup_submit_successful).toBe(false);
        expect(component.notifications.writeup_submit_error).toBe(false);
        expect(component.notifications.form_invalid).toBe(false);
        expect(component.notifications.file_upload_successful).toBe(true);
        expect(component.notifications.file_upload_error).toBe(false);
        expect(component.notifications.writeup_list_error).toBe(false);
        expect(component.notifications.writeup_load_error).toBe(false);
        expect(component.notifications.writeup_load_successful).toBe(false);
        expect(component.notifications.generic_error).toBe(false);
        expect(component.notifications.bad_request).toBe(false);

        expect(element.querySelector('#writeupSubmitSuccessfulAlert')).not.toBeTruthy();
        expect(element.querySelector('#writeupSubmitErrorAlert')).not.toBeTruthy();
        expect(element.querySelector('#formInvalidAlert')).not.toBeTruthy();
        expect(element.querySelector('#fileUploadSuccessfulAlert')).toBeTruthy();
        expect(element.querySelector('#fileUploadErrorAlert')).not.toBeTruthy();
        expect(element.querySelector('#writeupListErrorAlert')).not.toBeTruthy();
        expect(element.querySelector('#writeupLoadErrorAlert')).not.toBeTruthy();
        expect(element.querySelector('#writeupLoadSuccessfulAlert')).not.toBeTruthy();
        expect(element.querySelector('#genericErrorAlert')).not.toBeTruthy();
        expect(element.querySelector('#badRequestAlert')).not.toBeTruthy();
      });
    });
  });
});

function testInvalidForm(component: WriteupsComponent,
                        fixture: ComponentFixture<WriteupsComponent>,
                        element,
                        challengeName: string,
                        ctfName: string,
                        markdownInput: string) {
  component.notifications.form_invalid = false;
  component.formData.setValue({
    challengeName: challengeName,
    ctfName: ctfName,
    markdownInput: markdownInput
  });
  component.submitWriteup();

  fixture.detectChanges();
  fixture.whenStable().then(() => {
    expect(component.notifications.writeup_submit_successful).toBe(false);
    expect(component.notifications.writeup_submit_error).toBe(false);
    expect(component.notifications.form_invalid).toBe(true);
    expect(component.notifications.file_upload_successful).toBe(false);
    expect(component.notifications.file_upload_error).toBe(false);
    expect(component.notifications.writeup_list_error).toBe(false);
    expect(component.notifications.writeup_load_error).toBe(false);
    expect(component.notifications.writeup_load_successful).toBe(false);
    expect(component.notifications.generic_error).toBe(false);
    expect(component.notifications.bad_request).toBe(false);

    expect(element.querySelector('#writeupSubmitSuccessfulAlert')).not.toBeTruthy();
    expect(element.querySelector('#writeupSubmitErrorAlert')).not.toBeTruthy();
    expect(element.querySelector('#formInvalidAlert')).toBeTruthy();
    expect(element.querySelector('#fileUploadSuccessfulAlert')).not.toBeTruthy();
    expect(element.querySelector('#fileUploadErrorAlert')).not.toBeTruthy();
    expect(element.querySelector('#writeupListErrorAlert')).not.toBeTruthy();
    expect(element.querySelector('#writeupLoadErrorAlert')).not.toBeTruthy();
    expect(element.querySelector('#writeupLoadSuccessfulAlert')).not.toBeTruthy();
    expect(element.querySelector('#genericErrorAlert')).not.toBeTruthy();
    expect(element.querySelector('#badRequestAlert')).not.toBeTruthy();
  });
}
