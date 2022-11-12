import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() {
    return {
      message: 'Hello world!',
      ogTitle: 'Lazztech Hub - Social App - THIS IS A TEST',
      ogDescription: 'From app to the real world - Foster Community - THIS IS A TEST',
      ogImage: 'https://hub.lazz.tech/assets/banner.jpg - THIS IS A TEST',
    };
  }
}
