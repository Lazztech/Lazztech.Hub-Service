import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HubCardComponent } from './hub-card.component';

describe('HubCardComponent', () => {
  let component: HubCardComponent;
  let fixture: ComponentFixture<HubCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HubCardComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HubCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
