import { TestBed, inject } from '@angular/core/testing';

import { ExternalFileService } from './external-file.service';
import { RestService } from './rest.service';

class MockRestService {

}

describe('ExternalFileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExternalFileService,
        { provide: RestService, useClass: MockRestService }]
    });
  });

  it('should be created', inject([ExternalFileService], (service: ExternalFileService) => {
    expect(service).toBeTruthy();
  }));
});
