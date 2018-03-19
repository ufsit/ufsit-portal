import { Component, OnInit } from '@angular/core';
import { IConverterOptionsChangeable } from 'ngx-showdown';
import { ExternalFileService } from '../external-file.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-writeup-view',
  templateUrl: './writeup-view.component.html',
  styleUrls: ['./writeup-view.component.css']
})
export class WriteupViewComponent implements OnInit {
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

    // controls which notifications are displayed
    notifications = {
      writeup_load_error: false,
    };

  private writeupTitle = '';
  private writeupText = '';

  constructor(private externalFileService: ExternalFileService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.externalFileService
      .getWriteup(('writeups/' + this.route.snapshot.params.key)).subscribe(
        res => {
          console.log(res);
          this.setWriteupTitle(res.name, res.user_name);
          this.writeupText = res.text;
        }, err => {
          this.notifications.writeup_load_error = true;
          console.log(err);
        });
  }

  public setWriteupTitle(name: string, user: string) {
    this.writeupTitle = name + ' by ' + user;
  }

  public getWriteupTitle() {
    return this.writeupTitle;
  }

}
