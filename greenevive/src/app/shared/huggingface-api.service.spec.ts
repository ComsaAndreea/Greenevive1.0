import { TestBed } from '@angular/core/testing';

import { HuggingfaceApiService } from './huggingface-api.service';

describe('HuggingfaceApiService', () => {
  let service: HuggingfaceApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HuggingfaceApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
