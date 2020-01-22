import { Injectable } from '@angular/core';

import eruda from 'eruda';

@Injectable({
  providedIn: 'root'
})
export class DebuggerService {

  constructor() { }

  start() {
    eruda.init();
  }

  stop() {
    eruda.destroy();
  }
}
