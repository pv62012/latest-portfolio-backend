import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    constructor(private httpAdapterHost: HttpAdapterHost) { }

    catch(exception: any, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp()

        const httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

        this.logger.error(`Exception: ${exception.message}, stack: ${exception.stack}, code: ${JSON.stringify(exception)}`, '=====>>>>', JSON.stringify(exception.response) ,  '=====>>>>');

        const responseBody = {
            status: exception.status || httpStatus,
            message: exception.message || 'Internal Server error 😅'
        }

        if(exception.status === 400) {
            responseBody.message = exception?.response?.message
        }
        if (exception.status === 403) {
            responseBody.message = "You don't have access to this api"
        }
        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}