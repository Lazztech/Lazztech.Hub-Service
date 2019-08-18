import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPinPage } from './reset-pin.page';

describe('ResetPinPage', () => {
  let component: ResetPinPage;
  let fixture: ComponentFixture<ResetPinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPinPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
