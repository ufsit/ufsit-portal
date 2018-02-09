import { TestBed, inject } from '@angular/core/testing';

import { ProfileResolverService } from './profile-resolver.service';
import { SessionService } from './session.service';
import { RestService } from './rest.service';

class MockSessionService {
  private profile;

  constructor() {
    this.profile = {
      full_name: 'Mock User'
    };
  }

  public getProfile() {
    return this.profile;
  }
}

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
        {provide: SessionService, useClass: MockSessionService},
        {provide: RestService, useClass: MockRestService}
      ]
    });
  });

  it('should be created', inject([ProfileResolverService], (service: ProfileResolverService) => {
    expect(service).toBeTruthy();
  }));
});
