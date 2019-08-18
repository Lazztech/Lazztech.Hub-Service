import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeNamePage } from './change-name.page';

describe('ChangeNamePage', () => {
  let component: ChangeNamePage;
  let fixture: ComponentFixture<ChangeNamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeNamePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeNamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
