import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {

  @Get()
  @Render('index')
  root() {
    return {
      message: 'Hello world!',
      ogTitle: 'Lazztech Hub - Social App',
      ogDescription: 'From app to the real world - Foster Community',
      ogImage: 'https://hub.lazz.tech/assets/banner.webp',
    };
  }
}
