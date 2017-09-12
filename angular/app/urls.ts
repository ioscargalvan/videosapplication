import { isDevMode } from '@angular/core';

export class Urls {
  constructor() {
    console.log(isDevMode());
  }

  getMainUrl() {
    if(isDevMode()) {
      return "http://localhost/full_stack/symfony/web/app_dev.php/";
    } else {
      // Is Production!
      return "http://videosapp-com.stackstaging.com/backend/web/";
    }
  }
}
