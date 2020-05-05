import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdminHubPage } from './admin-hub.page';

describe('AdminHubPage', () => {
  let component: AdminHubPage;
  let fixture: ComponentFixture<AdminHubPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminHubPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminHubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
