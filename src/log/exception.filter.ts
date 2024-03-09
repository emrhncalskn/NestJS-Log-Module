import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { LogService } from './log.service';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
        private readonly logService: LogService
    ) { }


    catch(exception: unknown, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        this.logService.createLog(res, exception, true);
        httpAdapter.reply(ctx.getResponse(), exception, 500);
    }

}