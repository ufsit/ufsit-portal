import { TestBed, inject } from '@angular/core/testing';

import { AdminGuardService } from './admin-guard.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionService } from './session.service';

class MockSessionService {
  
}

describe('AdminGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminGuardService,
        {provide: SessionService, useClass: MockSessionService}],
      imports: [RouterTestingModule]
    });
  });

  it('should be created', inject([AdminGuardService], (service: AdminGuardService) => {
    expect(service).toBeTruthy();
  }));
});
