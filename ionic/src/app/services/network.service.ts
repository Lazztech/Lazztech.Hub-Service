import { Injectable } from '@angular/core';
import { Plugins, NetworkStatus } from '@capacitor/core';
import { PluginListenerHandle } from '@capacitor/core/dist/esm/web/network';
import { AlertService } from './alert.service';

const { Network } = Plugins;
// type NetworkCallback = (connected: boolean) => any;

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  handler: PluginListenerHandle;
  network = Network;

  constructor(
    private alertService: AlertService
  ) { 
    this.handler = Network.addListener('networkStatusChange', async (status) => {
      console.log("Network status changed", status);

      try {
        if (status.connected) {
          await alertService.presentToast(JSON.stringify(status));
        } else {
          await alertService.presentRedToast(JSON.stringify(status));
        }
      } catch (error) {
        console.log(error)
      }
    });
    // To stop listening:
    // handler.remove();
  }

  // onNetworkConnectedStatusChange(callback: NetworkCallback){
  //   this.handler = Network.addListener('networkStatusChange', async (status) => {
  //     console.log("Network status changed", status);

  //     try {
  //       if (status.connected) {
          
  //       } else {
          
  //       }
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   });
  // }

  async getStatus(): Promise<NetworkStatus> {
    return await Network.getStatus();
  }

  async isConnected(): Promise<boolean> {
    let status = await this.getStatus();
    return status.connected;
  }

}
