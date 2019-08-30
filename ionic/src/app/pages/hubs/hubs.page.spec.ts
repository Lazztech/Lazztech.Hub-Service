import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubsPage } from './hubs.page';

describe('HubsPage', () => {
  let component: HubsPage;
  let fixture: ComponentFixture<HubsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
