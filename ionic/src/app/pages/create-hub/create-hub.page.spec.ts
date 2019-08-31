import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHubPage } from './create-hub.page';

describe('CreateHubPage', () => {
  let component: CreateHubPage;
  let fixture: ComponentFixture<CreateHubPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateHubPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateHubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
