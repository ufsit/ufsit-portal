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
  public uploadWriteup(data: string, writeupName: string, writeupId: number) {
    if (data === 'success') {
      return of(new Response());
    }
  }

  public getWriteup(id: number) {
    return of({
      name: 'writeup name',
      description: 'description',
      text: 'test',
      id: id
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
      {name: 'Writeup1', id: 1},
      {name: 'Writeup2', id: 2}
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
      testInvalidForm(component, fixture, element, '', '');
      testInvalidForm(component, fixture, element, '', 'test');
      testInvalidForm(component, fixture, element, 'writeup name', '');
    });
  });

  describe('submitting a writeup', () => {
    it('should notify the user on success', () => {
      component.formData.patchValue({
        writeupName: 'name',
        writeupDescription: 'test',
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
      component.switchToUpdate();

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const rows = fixture.nativeElement.querySelectorAll('tbody tr');
        expect(rows.length).toBe(2);
        expect(rows[0].innerHTML.indexOf('Writeup1')).not.toBe(-1);
        expect(rows[0].innerHTML.indexOf('Writeup2')).toBe(-1);

        expect(rows[1].innerHTML.indexOf('Writeup1')).toBe(-1);
        expect(rows[1].innerHTML.indexOf('Writeup2')).not.toBe(-1);
      });
    });
  });

  describe('loading writeup', () => {
    it('should load submitted writeups', () => {
      component.load(3);

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(element.querySelector('showdown').innerHTML.indexOf('test')).not.toBe(-1);

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
    it('should upload file when successful', () => {
      component.file = new File(['data'], 'file.jpg');
      component.uploadFile();

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(element.querySelector('#fileBank').innerHTML
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
                        writeupName: string,
                        markdownInput: string) {
  component.notifications.form_invalid = false;
  component.formData.patchValue({
    writeupName: writeupName,
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
