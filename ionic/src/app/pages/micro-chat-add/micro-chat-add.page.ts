import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { HubService } from 'src/app/services/hub/hub.service';

@Component({
  selector: 'app-micro-chat-add',
  templateUrl: './micro-chat-add.page.html',
  styleUrls: ['./micro-chat-add.page.scss'],
})
export class MicroChatAddPage implements OnInit {

  loading = false;
  @Input()
  hubId: any;
  myForm: FormGroup;

  get text() {
    return this.myForm.get('text');
  }

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private hubService: HubService
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      text: ['', [
        Validators.required,
        Validators.maxLength(10)
      ]],
    });
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  async save() {
    this.loading = true;
    const formValue = this.myForm.value;
    await this.hubService.createMicroChat(this.hubId, formValue.text);
    this.loading = false;
    this.dismissModal();
  }

}
