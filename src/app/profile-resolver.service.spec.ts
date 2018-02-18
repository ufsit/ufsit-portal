import { TestBed, inject } from '@angular/core/testing';

import { ProfileResolverService } from './profile-resolver.service';
import { RestService } from './rest.service';

class MockRestService {
  public getProfile() {
    return {
      full_name: 'Mock User'
    };
  }
}

describe('ProfileResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProfileResolverService,
        {provide: RestService, useClass: MockRestService}
      ]
    });
  });

  it('should be created', inject([ProfileResolverService], (service: ProfileResolverService) => {
    expect(service).toBeTruthy();
  }));
});
