import { TestBed, inject } from '@angular/core/testing';

import { HomeResolverService } from './home-resolver.service';
import { SessionService } from './session.service';
import { RestService } from './rest.service';

class MockSessionService {
  private profile = null;

  public getProfile() {
    return this.profile;
  }
}

class MockRestService {
  private profile = null;

  public getProfile() {
    return this.profile;
  }
}

describe('HomeResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HomeResolverService,
        {provide: SessionService, useClass: MockSessionService},
        {provide: RestService, useClass: MockRestService}
      ]
    });
  });

  it('should be created', inject([HomeResolverService], (service: HomeResolverService) => {
    expect(service).toBeTruthy();
  }));
});
