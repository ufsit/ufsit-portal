import { Injectable } from '@angular/core';
import { RestService } from './rest.service';

@Injectable()
export class ExternalFileService {

  constructor(private restService: RestService) {
  }

  public uploadWriteup(data: string, ctfName: string, challengeName: string) {
    return this.restService.uploadWriteup(data, ctfName, challengeName);
  }

  public getWriteup(ctfName: string, challengeName: string, fileName: string) {
    return this.restService.getWriteup(ctfName, challengeName, fileName);
  }

}
