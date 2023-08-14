import { TestBed } from '@angular/core/testing';

import { AuthJwtInterceptor } from './auth-jwt.interceptor';

describe('AuthJwtInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AuthJwtInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: AuthJwtInterceptor = TestBed.inject(AuthJwtInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
