import { Component, OnInit } from '@angular/core';
import { ExternalFileService } from '../external-file.service';
import { RestService } from '../rest.service';
import { DomSanitizer, SafeHtml} from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent implements OnInit {

  // controls which notifications are displayed
  notifications = {
    resume_upload_successful: false,
    resume_upload_error: false,
    resume_invalid_filetype: false,
    resume_get_error: false,
    generic_error: false,
    bad_request: false
  };

  // holds currently selected file
  file: File = null;

  // holds the additional question answers
  form: FormGroup;

  // hold the currently uploaded resume link
  resumeLink = window.location.origin + '/api/resume';
  innerHtml: SafeHtml;

  constructor(private externalFileService: ExternalFileService,
              private restService: RestService,
              private domSanitizer: DomSanitizer) {
    const formBuilder = new FormBuilder();
    this.form = formBuilder.group({
      research: ['', Validators.required],
      internship: ['', Validators.required],
      major: ['', Validators.required],
      grad_date: ['', Validators.required],
      gpa: ['', Validators.required,
                this.correctRange]
    });
  }

  ngOnInit() {
    this.getResumeLink();
    this.getAdditionalQuestionAnswers();
  }

  // keeps the internal file variable up to date with the user's selection
  public handleFileChange(files: FileList) {
    this.file = files.item(0);
  }

  getResumeLink() {
    this.externalFileService.getResumeLink().subscribe(
      res => {
        if (res.resume !== '') {
          this.innerHtml = this.domSanitizer.bypassSecurityTrustHtml(
            '<object data="' + this.resumeLink + '" class="embed-responsive-item col-12">' +
              '<iframe src="' + this.resumeLink + '" class="embed-responsive-item col-12"></iframe>' +
              '</object>'
          );
        } else {
          this.innerHtml = this.domSanitizer.bypassSecurityTrustHtml(
            '<h5>You have not uploaded a resume yet.</h5>'
          );
        }
      },
      err => {
        this.innerHtml = this.domSanitizer.bypassSecurityTrustHtml(
          '<h5>You have not uploaded a resume yet.</h5>'
        );
      }
    );
  }

  public submitForm() {
    if (this.file !== undefined && this.file != null) {
      this.uploadResume();
    }

    this.restService.submitResumeQuestions(this.form.value).subscribe(
      res => {
        this.notifications.resume_upload_successful = true;
      }, err => {
        this.notifications.resume_upload_error = true;
      }
    );
  }

  uploadResume() {
    // get a signed url we can use to directly upload the resume
    this.externalFileService.signResume(this.file.name, this.file.type).subscribe(
      res => {
        // upload the resume to the provided url
        this.externalFileService.uploadFile(this.file, res.url).subscribe(
          uploadRes => {
            // add the file to the list of uploaded files
            this.getResumeLink();
            this.notifications.resume_upload_successful = true;
          },
          uploadErr => {
            this.notifications.resume_upload_error = true;
            console.log(uploadErr);
          }
        );
      },
      err => {
        console.log(err.status);
        if (err.status === 415) {
          this.notifications.resume_invalid_filetype = true;
        } else {
          this.notifications.resume_upload_error = true;
        }
      }
    );
  }

  public isValidFileType(): boolean {
    if (this.file === undefined || this.file == null) {
      return true;
    }

    return this.file.type === 'application/pdf';
  }

  public getAdditionalQuestionAnswers() {
    this.restService.getResumeQuestions().subscribe(
      res => {
        this.form.setValue({
          research: res.research ? 'true' : 'false',
          internship: res.internship ? 'true' : 'false',
          major: res.major,
          grad_date: res.grad_date,
          gpa: res.gpa
        });
      },
      err => {
        this.notifications.resume_get_error = true;
      }
    );
  }

  public correctRange(control: FormControl): ValidationErrors {
    const value = control.value;
    if (value >= 0 && value <= 4) {
      return of(null);
    }
    return of({'incorrectGpaRange': true});
  }

}
