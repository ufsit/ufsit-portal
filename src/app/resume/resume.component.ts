import { Component, OnInit } from '@angular/core';
import { ExternalFileService } from '../external-file.service';
import { RestService } from '../rest.service';
import { DomSanitizer, SafeHtml} from '@angular/platform-browser';

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
    generic_error: false,
    bad_request: false
  };

  // holds currently selected file
  file: File = null;

  // hold the currently uploaded resume link
  resumeLink = window.location.origin + '/api/resume';
  innerHtml: SafeHtml;

  constructor(private externalFileService: ExternalFileService,
              private restService: RestService,
              private domSanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getResumeLink();
  }

  // keeps the internal file variable up to date with the user's selection
  public handleFileChange(files: FileList) {
    this.file = files.item(0);
  }

  getResumeLink() {
    console.log('here');
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
            '<p>You have not uploaded a resume yet.</p>'
          );
        }
      },
      err => {
        console.log(err);
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
        this.notifications.resume_upload_error = true;
        console.log(err);
      }
    );
  }

}
