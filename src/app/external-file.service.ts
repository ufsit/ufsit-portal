import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { SessionService } from './session.service';

@Injectable()
export class ExternalFileService {

  constructor(private restService: RestService,
              private sessionService: SessionService) {
  }

  // gets a signed url to upload an file
  public signFile(fileName: string, fileType: string) {
    return this.restService.signFile(fileName, fileType);
  }

  // uploads a writeup
  public uploadWriteup(data: string, ctfName: string, challengeName: string) {
    return this.restService.uploadWriteup(data, ctfName, challengeName);
  }

  // gets a writeup
  public getWriteup(ctfName: string, challengeName: string, fileName: string) {
    return this.restService.getWriteup(ctfName, challengeName, fileName);
  }

  // uploads an file
  public uploadFile(file: File, url: string) {
    return this.restService.uploadFile(file, url);
  }

}
