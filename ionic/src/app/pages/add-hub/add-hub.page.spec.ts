import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHubPage } from './add-hub.page';

describe('AddHubPage', () => {
  let component: AddHubPage;
  let fixture: ComponentFixture<AddHubPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddHubPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
