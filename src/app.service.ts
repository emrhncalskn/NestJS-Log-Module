import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AppService {
  getHello(): string {
    //throw new Error('Test Error in getHello method');
    return 'Hello World!';
  }
}
