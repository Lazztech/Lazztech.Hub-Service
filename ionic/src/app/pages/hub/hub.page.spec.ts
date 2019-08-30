import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubPage } from './hub.page';

describe('HubPage', () => {
  let component: HubPage;
  let fixture: ComponentFixture<HubPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
