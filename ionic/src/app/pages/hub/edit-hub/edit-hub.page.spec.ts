import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHubPage } from './edit-hub.page';

describe('EditHubPage', () => {
  let component: EditHubPage;
  let fixture: ComponentFixture<EditHubPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditHubPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
