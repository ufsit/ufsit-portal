import { TestBed, inject } from '@angular/core/testing';

import { ExternalFileService } from './external-file.service';

describe('ExternalFileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExternalFileService]
    });
  });

  it('should be created', inject([ExternalFileService], (service: ExternalFileService) => {
    expect(service).toBeTruthy();
  }));
});
