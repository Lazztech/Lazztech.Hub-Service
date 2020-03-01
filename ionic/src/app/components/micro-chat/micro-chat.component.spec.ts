import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MicroChatComponent } from './micro-chat.component';

describe('MicroChatComponent', () => {
  let component: MicroChatComponent;
  let fixture: ComponentFixture<MicroChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroChatComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MicroChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
