import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateLogDto } from "./dto/log.dto";
import { Log } from "./entities/log.entity";
import { Response } from 'express';

@Injectable()
export class LogService {

    constructor(
        @InjectRepository(Log)
        private logRepository: Repository<Log>
    ) { }

    async getResponseLog(res: Response) {

        try {
            const rawResponse = res.write;
            const rawResponseEnd = res.end;

            const chunkBuffers = [];

            res.write = (...chunks) => {
                try {
                    const resArgs = [];
                    for (let i = 0; i < chunks.length; i++) {
                        resArgs[i] = chunks[i];

                        if (!resArgs[i]) {
                            res.once('drain', res.write);

                            --i;
                        }
                    }
                    if (resArgs[0]) {
                        chunkBuffers.push(Buffer.from(resArgs[0]));
                    }

                    return rawResponse.apply(res, resArgs);
                }
                catch (e) { this.createLog(res, JSON.stringify({ msg: 'Error in log middleware', error: e.message }), true); return rawResponse.apply(res, chunks) }


            };

            res.end = (...chunk) => {
                try {
                    res.setHeader('origin', 'log-middleware');
                    let data: any = this.processHttpResponseChunk(chunk, res)
                    data ? data = chunk : data;

                    return rawResponseEnd.apply(res, data || chunk);
                }
                catch (e) { this.createLog(res, JSON.stringify({ msg: 'Error in log middleware', error: e.message }), true); return rawResponseEnd.apply(res, chunk) }

            }

        }
        catch (e) { this.createLog(res, JSON.stringify({ msg: 'Error in log middleware', error: e.message }), true); }

    }



    processHttpResponseChunk(chunk: any, res) {
        try {

            const resArgs = [];
            const chunkBuffers = [];

            for (let i = 0; i < chunk.length; i++) {
                resArgs[i] = chunk[i];
            }

            if (resArgs[0]) { chunkBuffers.push(Buffer.from(resArgs[0])); }

            let response_body: any = Buffer.concat(chunkBuffers).toString('utf8');

            try {
                response_body = JSON.parse(response_body)
            }
            catch (e) { { response_body = { response_body, msg: "Response body is not a JSON" } } }

            this.createLog(res, response_body, false);

        }
        catch (e) { this.createLog(res, JSON.stringify({ msg: 'Error in log middleware', error: e.message }), true) }
    }


    async createLog(res: Response, response_body: any, isError?: boolean) {
        try {

            let statusCode, routePath;

            !isError ? (routePath = res.req.route.path, statusCode = res.statusCode, response_body = JSON.stringify(response_body))
                : (routePath = res.req.originalUrl, statusCode = 500)

            const data: CreateLogDto = {
                method: res.req.method,
                api: routePath,
                body: JSON.stringify(res.req.body),
                params: JSON.stringify(res.req.params),
                query: JSON.stringify(res.req.query),
                headers: JSON.stringify(res.getHeaders()),
                response_body: response_body, //JSON stringfiy atmak sanırım sorunu çözdü
                status_code: statusCode,
            };

            console.log('DATA :: ', data)


            const create_log = this.logRepository.create(data);
            console.log('CREATE_LOG :: ', create_log)
            await this.logRepository.save(create_log);

            isError ? console.log(`LOGGER ERROR!! :: ${console.log(`ERROR!! :: ${JSON.stringify(create_log)}`)}`) : null;

            return create_log;
        }
        catch (e) { this.createLog(res, JSON.stringify({ msg: 'Error in Log Middleware TRY-CATCH', error: e }), true); console.log(`LOGGER TRY-CATCH ERROR!! :: ${e}`); }
    }

}