import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(@Res() res): string {
    try {
      const result = this.appService.getHello();
      res.status(200).send(result);
      return result;
    }
    catch (e) {
      res.status(500).send(e.message);
    }
  }

}
