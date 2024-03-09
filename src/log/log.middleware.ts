import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LogService } from './log.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {

  constructor(
    private logService: LogService
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      await this.logService.getResponseLog(res);
      if (next) {
        next();
        return;
      }
    }

    catch (e) {
      await this.logService.createLog(res, JSON.stringify({ msg: 'Error in log middleware', error: e.message }), true);
      next();
      return;
    }
  }

}





