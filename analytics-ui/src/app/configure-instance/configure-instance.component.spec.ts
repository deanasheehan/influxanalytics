import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureInstanceComponent } from './configure-instance.component';

describe('ConfigureInstanceComponent', () => {
  let component: ConfigureInstanceComponent;
  let fixture: ComponentFixture<ConfigureInstanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureInstanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
