import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, NgModel, Validators } from '@angular/forms';
import { IConverterOptionsChangeable } from 'ngx-showdown';
import { ExternalFileService } from '../external-file.service';
import { RestService } from '../rest.service';


@Component({
  selector: 'app-writeups',
  templateUrl: './writeups.component.html',
  styleUrls: ['./writeups.component.css']
})
export class WriteupsComponent implements OnInit {
  // showdown options
  options: IConverterOptionsChangeable = {
    omitExtraWLInCodeBlocks:              true,
    simplifiedAutoLink:                   true,
    excludeTrailingPunctuationFromURLs:   true,
    literalMidWordUnderscores:            true,
    strikethrough:                        true,
    tables:                               true,
    tablesHeaderId:                       true,
    ghCodeBlocks:                         true,
    tasklists:                            true,
    disableForced4SpacesIndentedSublists: true,
    requireSpaceBeforeHeadingText:        true,
    ghCompatibleHeaderId:                 true,
    ghMentions:                           true,
    backslashEscapesHTMLTags:             true,
    emoji:                                true
  };
  // holds CTF name and challenge name
  formData: FormGroup;
  // holds currently selected file
  file: File = null;
  // holds the markdown input being shown in the preview tab
  setMarkdownInput = '';
  // holds a list of all submitted writeups
  submittedWriteups = [];
  // holds a list of uploaded files
  files = [];
  // hold the name of the file to be uploaded
  // uploadedFilename = '';

  // hides/displays tabs
  hidden = {
    write: false,
    preview: true,
    files: true,
    update: true
  };

  // controls which notifications are displayed
  notifications = {
    writeup_submit_successful: false,
    writeup_submit_error: false,
    form_invalid: false,
    file_upload_successful: false,
    file_upload_error: false,
    writeup_list_error: false,
    writeup_load_error: false,
    writeup_load_successful: false,
    generic_error: false,
    bad_request: false
  };

  constructor(private externalFileService: ExternalFileService,
              private restService: RestService) { }

  ngOnInit() {
    // add the form requirements
    const fb: FormBuilder = new FormBuilder();
    this.formData = fb.group({
      writeupName: ['', [
        Validators.required
      ]],
      markdownInput: ['', [
        Validators.required
      ]],
      writeupId: [0, []]
    });
  }

  // hides all the tab content
  public hideAll() {
    for (const key of Object.keys(this.hidden)) {
      this.hidden[key] = true;
      document.getElementById(key + 'Tab').classList.remove('active');
    }
  }

  // hide all tab content, then display write tab
  public switchToWrite() {
    this.hideAll();
    this.hidden.write = false;
    document.getElementById('writeTab').classList.add('active');
  }

  // hide all tab content, then display preview tab and update markdown preview
  public switchToPreview() {
    this.hideAll();
    this.hidden.preview = false;
    document.getElementById('previewTab').classList.add('active');
    this.setMarkdownInput = this.formData.value.markdownInput;
  }

  // hide all tab content, then display files tab
  public switchToFiles() {
    this.hideAll();
    this.hidden.files = false;
    document.getElementById('filesTab').classList.add('active');
    this.getUploadedFiles();
  }

  // hide all tab content, then display update tab
  public switchToUpdate() {
    this.hideAll();
    this.hidden.update = false;
    document.getElementById('updateTab').classList.add('active');
    this.getSubmittedWriteups();
  }

  // submit write up
  public submitWriteup() {
    if (!this.formData.valid) {
      this.notifications.form_invalid = true;
      return;
    }
    this.externalFileService.uploadWriteup(this.formData.value.markdownInput,
                                          this.formData.value.writeupName,
                                          this.formData.value.writeupId)
      .subscribe(
        res => {
          this.notifications.writeup_submit_successful = true;
          this.formData.patchValue({
            writeupId: (<any>res).writeupId
          });
        },
        err => {
          this.notifications.writeup_submit_error = true;
          // console.log(err);
        }
      );

  }

  // gets a list of all writeups submitted by the user
  public getSubmittedWriteups() {
    this.restService.getSubmittedWriteups().subscribe(
      res => {
        // clear the list of submitted writeups
        this.submittedWriteups = [];
        // iterate over each writeup entry
        for (const entry of res) {
          // let pieces = entry.key.split('/');
          // add the information from each entry to the list
          this.submittedWriteups.push({
            // ctfName: pieces[1],
            // challengeName: pieces[2],
            // fileName: pieces[3]
            writeupName: entry.name,
            id: entry.id
          });
        }
      },
      err => {
        this.notifications.writeup_list_error = true;
        console.log(err);
      }
    );
  }

  // loads a previously submitted writeup
  public load(id: number) {
    // get the writeup
    this.externalFileService.getWriteup(id).subscribe(
      res => {
        // update the form with the writeup information
        this.formData.patchValue({
          writeupName: res.name,
          markdownInput: res.text,
          writeupId: id
        });
        this.setMarkdownInput = res.text;
        this.notifications.writeup_load_successful = true;
      },
      err => {
        this.notifications.writeup_load_error = true;
        console.log(err);
      }
    );
  }

  // keeps the internal file variable up to date with the user's selection
  public handleFileChange(files: FileList) {
    this.file = files.item(0);
  }

  // uploads an file
  public uploadFile() {
    // get a signed url we can use to directly upload the file
    this.externalFileService.signFile(this.file.name, this.file.type).subscribe(
      res => {
        // upload the file to the provided url
        this.externalFileService.uploadFile(this.file, res.url).subscribe(
          uploadRes => {
            // add the file to the list of uploaded files
            this.files.push(window.location.origin + '/api/' + res.key);
            this.notifications.file_upload_successful = true;
          },
          uploadErr => {
            this.notifications.file_upload_error = true;
            console.log(uploadErr);
          }
        );
      },
      err => {
        this.notifications.file_upload_error = true;
        console.log(err);
      }
    );
  }

  // gets a list of all writeups submitted by the user
  public getUploadedFiles() {
    this.restService.getUploadedFiles().subscribe(
      res => {
        // clear the list of submitted writeups
        this.files = [];
        // iterate over each writeup entry
        for (const entry of res) {
          // add each entry to the list
          this.files.push(window.location.origin + '/api' + entry.key);
        }
      },
      err => {
        this.notifications.writeup_list_error = true;
        console.log(err);
      }
    );
  }

  public isImage(filename) {
    let fileExt = filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2); // tslint:disable-line
    fileExt = fileExt.toLowerCase();
    if (fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'exif'
      || fileExt === 'tiff' || fileExt === 'gif' || fileExt === 'bmp'
      || fileExt === 'png') {
        return true;
    }
    return false;
  }

}
