import { NgModule } from "@angular/core";
import { GoogleMapComponent } from './google-map/google-map.component';
import { HubCardComponent } from './hub-card/hub-card.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [GoogleMapComponent, HubCardComponent],
    imports: [IonicModule, CommonModule],
    exports: [GoogleMapComponent, HubCardComponent]
})
export class ComponentsModule {

}
