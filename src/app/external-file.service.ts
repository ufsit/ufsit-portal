import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { SessionService } from './session.service';

@Injectable()
export class ExternalFileService {

  constructor(private restService: RestService,
              private sessionService: SessionService) {
  }

  // gets a signed url to upload an image
  public signImage(fileName: string, fileType: string) {
    return this.restService.signImage(fileName, fileType);
  }

  // uploads a writeup
  public uploadWriteup(data: string, ctfName: string, challengeName: string) {
    return this.restService.uploadWriteup(data, ctfName, challengeName);
  }

  // gets a writeup
  public getWriteup(ctfName: string, challengeName: string, fileName: string) {
    return this.restService.getWriteup(ctfName, challengeName, fileName);
  }

  // uploads an image
  public uploadImage(image: File, url: string) {
    return this.restService.uploadImage(image, url);
  }

}
