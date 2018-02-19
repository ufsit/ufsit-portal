import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, NgModel } from '@angular/forms';
import { IConverterOptionsChangeable } from 'ngx-showdown';


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
  markdownInput = '';
  setMarkdownInput = '';

  hidden = {
    write: false,
    preview: true
  };

  constructor() { }

  ngOnInit() {
    /*const fb: FormBuilder = new FormBuilder();
    this.formData = fb.group({
      markdownInput: ['', []]
    });*/
  }

<<<<<<< HEAD
=======
  public getHtml() {
    //return this.converter.makeHtml(this.markdownInput);

  }

>>>>>>> 06341d085f0cbe6f832346e72cd63df4b72e9d24
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
    this.setMarkdownInput = this.markdownInput;
  }

}
