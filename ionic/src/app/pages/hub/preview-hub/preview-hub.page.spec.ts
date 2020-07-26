import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PreviewHubPage } from './preview-hub.page';

describe('PreviewHubPage', () => {
  let component: PreviewHubPage;
  let fixture: ComponentFixture<PreviewHubPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewHubPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewHubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
