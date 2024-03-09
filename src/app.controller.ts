import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @ApiBearerAuth()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  randomDigits(@Res() res: Response) {
    return this.appService.randomDigits(res);
  }
}
