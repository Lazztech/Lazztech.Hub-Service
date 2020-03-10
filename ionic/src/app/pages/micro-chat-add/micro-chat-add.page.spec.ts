import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MicroChatAddPage } from './micro-chat-add.page';

describe('MicroChatAddPage', () => {
  let component: MicroChatAddPage;
  let fixture: ComponentFixture<MicroChatAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroChatAddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MicroChatAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
