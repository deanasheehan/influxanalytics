import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogItemDetailComponent } from './catalog-item-detail.component';

describe('CatalogItemDetailComponent', () => {
  let component: CatalogItemDetailComponent;
  let fixture: ComponentFixture<CatalogItemDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogItemDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogItemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
