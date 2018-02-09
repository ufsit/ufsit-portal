import { TestBed, inject } from '@angular/core/testing';

import { SessionService } from './session.service';
import { RouterTestingModule } from '@angular/router/testing';
import { RestService } from './rest.service';

class MockRestService {

}

describe('SessionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SessionService,
        { provide: RestService, useClass: MockRestService }
      ],
      imports: [ RouterTestingModule ]
    });
  });

  it('should be created', inject([SessionService], (service: SessionService) => {
    expect(service).toBeTruthy();
  }));
});
