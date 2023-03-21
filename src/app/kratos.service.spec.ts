import { TestBed } from '@angular/core/testing';

import { KratosService } from './kratos.service';

describe('KratosService', () => {
  let service: KratosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KratosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
