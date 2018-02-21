import { Injectable } from '@angular/core';
import { RestService } from './rest.service';

@Injectable()
export class ExternalFileService {

  constructor(private restService: RestService) {
  }

  public uploadWriteup(data: string, ctfName: string, challengeName: string) {
    this.restService.uploadWriteup(data, ctfName, challengeName).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }

}
