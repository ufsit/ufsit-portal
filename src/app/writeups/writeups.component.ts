import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, NgModel, Validators } from '@angular/forms';
import { IConverterOptionsChangeable } from 'ngx-showdown';
import { ExternalFileService } from '../external-file.service';


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

  hidden = {
    write: false,
    preview: true
  };

  constructor(private externalFileService: ExternalFileService) { }

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

  public switchToWrite() {
    this.hidden.write = false;
    this.hidden.preview = true;
    document.getElementById('writeTab').classList.add('active');
    document.getElementById('previewTab').classList.remove('active');
  }

  public switchToPreview() {
    this.hidden.write = true;
    this.hidden.preview = false;
    document.getElementById('writeTab').classList.remove('active');
    document.getElementById('previewTab').classList.add('active');
    this.setMarkdownInput = this.formData.value.markdownInput;
  }

  public submitWriteup() {
    let file = new File([this.formData.value.markdownInput], 'upload.md', {type: 'text/plain'});
    this.externalFileService.UploadWriteUp(file);

  }

}
