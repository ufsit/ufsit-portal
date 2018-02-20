import { Injectable } from '@angular/core';
import { RestService } from './rest.service';

@Injectable()
export class ExternalFileService {

  constructor(private restService: RestService) {
  }

  public UploadWriteUp(file: File) {
    this.restService.getSignedRequest(file).subscribe(
    res => {
      console.log(res);
      if (res.status === 200) {
        const response = JSON.parse(res);
        this.restService.uploadWriteup(file, response.signedRequest)
      }
    },
    err => {
      console.log(err);
    });
    console.log(file);
  }

}
