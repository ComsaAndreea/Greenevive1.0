import { TestBed } from '@angular/core/testing';

import { GptAPIService } from './gpt-api.service';

describe('GptAPIService', () => {
  let service: GptAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GptAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
