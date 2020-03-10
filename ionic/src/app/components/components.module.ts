import { NgModule } from "@angular/core";
import { GoogleMapComponent } from './google-map/google-map.component';
import { HubCardComponent } from './hub-card/hub-card.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivityDotComponent } from './activity-dot/activity-dot.component';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MicroChatComponent } from './micro-chat/micro-chat.component';
import { MicroChatAddPageModule } from '../pages/micro-chat-add/micro-chat-add.module';
import { MicroChatAddPage } from '../pages/micro-chat-add/micro-chat-add.page';

@NgModule({
    declarations: [
        GoogleMapComponent, 
        HubCardComponent,
        ActivityDotComponent,
        ProfileComponent,
        MicroChatComponent,
        MicroChatAddPage
    ],
    imports: [
        IonicModule, 
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        GoogleMapComponent, 
        HubCardComponent,
        ActivityDotComponent,
        ProfileComponent,
        MicroChatComponent
    ]
})
export class ComponentsModule {

}
