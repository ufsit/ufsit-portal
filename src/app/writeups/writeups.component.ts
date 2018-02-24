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
  formData: FormGroup;
  setMarkdownInput = '';
  submittedWriteups = [];
  s3Link = 'https://s3.amazonaws.com/ufsit-portal-storage/writeups/';

  hidden = {
    write: false,
    preview: true,
    images: true,
    update: true
  };

  constructor(private externalFileService: ExternalFileService,
              private restService: RestService) { }

  ngOnInit() {
    const fb: FormBuilder = new FormBuilder();
    this.formData = fb.group({
      challengeName: ['', [
        Validators.required
      ]],
      ctfName: ['', [
        Validators.required
      ]],
      markdownInput: ['', [
        Validators.required
      ]]
    });
  }

  public hideAll() {
    for (const key of Object.keys(this.hidden)) {
      this.hidden[key] = true;
      document.getElementById(key + 'Tab').classList.remove('active');
    }
  }

  public switchToWrite() {
    this.hideAll();
    this.hidden.write = false;
    document.getElementById('writeTab').classList.add('active');
  }

  public switchToPreview() {
    this.hideAll();
    this.hidden.preview = false;
    document.getElementById('previewTab').classList.add('active');
    this.setMarkdownInput = this.formData.value.markdownInput;
  }

  public switchToImages() {
    this.hideAll();
    this.hidden.images = false;
    document.getElementById('imagesTab').classList.add('active');
  }

  public switchToUpdate() {
    this.hideAll();
    this.hidden.update = false;
    document.getElementById('updateTab').classList.add('active');
    this.getSubmittedWriteups();
  }

  public submitWriteup() {
    this.externalFileService.uploadWriteup(this.formData.value.markdownInput,
                                          this.formData.value.ctfName,
                                          this.formData.value.challengeName)
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );

  }

  public getSubmittedWriteups() {
    this.restService.getSubmittedWriteups().subscribe(
      res => {
        this.submittedWriteups = [];
        for (const entry of res) {
          let pieces = entry.key.split('/');
          console.log(pieces);
          this.submittedWriteups.push({
            ctfName: pieces[1],
            challengeName: pieces[2],
            fileName: pieces[3]
          });
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  public load(ctfName: string, challengeName: string, fileName: string) {
    this.externalFileService.getWriteup(ctfName, challengeName, fileName).subscribe(
      res => {
        console.log(res);
        this.formData.patchValue({
          ctfName: res.ctfName,
          challengeName: res.challengeName,
          markdownInput: res.text
        });
        this.setMarkdownInput = res.text;
      },
      err => {
        console.log(err);
      }
    );
  }

}
