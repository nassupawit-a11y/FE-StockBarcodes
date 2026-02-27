import { TestBed } from '@angular/core/testing';

import { BarcodeService } from './barcode-service';

describe('Barcode', () => {
  let service: BarcodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarcodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
