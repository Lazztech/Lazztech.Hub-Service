import { NgModule } from "@angular/core";
import { GoogleMapComponent } from './google-map/google-map.component';
import { HubCardComponent } from './hub-card/hub-card.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivityDotComponent } from './activity-dot/activity-dot.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
    declarations: [
        GoogleMapComponent, 
        HubCardComponent,
        ActivityDotComponent,
        ProfileComponent
    ],
    imports: [IonicModule, CommonModule],
    exports: [
        GoogleMapComponent, 
        HubCardComponent,
        ActivityDotComponent,
        ProfileComponent
    ]
})
export class ComponentsModule {

}
