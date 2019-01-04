import { TestBed } from '@angular/core/testing';

import { InstancesService } from './instances.service';

describe('InstancesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InstancesService = TestBed.get(InstancesService);
    expect(service).toBeTruthy();
  });
});
