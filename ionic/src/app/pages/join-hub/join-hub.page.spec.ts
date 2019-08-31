import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinHubPage } from './join-hub.page';

describe('JoinHubPage', () => {
  let component: JoinHubPage;
  let fixture: ComponentFixture<JoinHubPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinHubPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinHubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
